import './tooltip'
import debounce from "./helpers/debonce"
import renderPreloader from "./Components/preloader"
import renderUser from "./Components/user"


const ENDPOINT_URL = 'https://randomuser.me/api/?results=1000' // url, который подберет случайных пользователей
let userData = [] // массив, где будут содержаться полученные пользователи

const searchInput = document.getElementById('search') // поле фильтрации
const buttonClear = document.getElementById('button-clear') // кнопка очистки поля фильтрации
const contentDataElem = document.getElementById('content-data') // элемент, где содержиться весь контент
const contentTableElem = document.getElementById('content-table') // обертка для элемента таблицы
const usersListElem = document.getElementById('content-list') // список, где будут отображаться пользователи (tbody)
const nFoundElem = document.getElementById('n-found') // элемент сигнализирующий о том, что ничего не найдено


// функция, которая загружает пользователей с сервера, а затем добавляет в соотвествующий массив и рисует их на странице
function loadData() {
    setFetchingView(true)
    fetch(ENDPOINT_URL)
        .then((res) => res.json())
        .then((data) => {
            userData = data?.results

            if (!userData) {
                throw new Error(data.error || 'Что-то пошло не так, попробуйте позднее')
            }

            drawUserData(userData)
        })
        .catch((e) => console.log(e.message))
        .finally(() => setFetchingView(false))
}

// функция, которая...
function drawUserData(userData) {
    usersListElem.innerHTML = '' // очищает старых пользователей из DOM

    if (userData && userData.length > 0) { // проверяет есть ли доступные пользователи (если нет, то показываем "nFoundElem")
        nFoundElem.style.display = 'none'
        contentTableElem.style.display = 'flex'

        userData.forEach((user) => { // добавляет новых пользователей в DOM
            instantiateUserElement(user)
        })
    } else {
        nFoundElem.style.display = 'block'
        contentTableElem.style.display = 'none'
    }
}

// функиця фильтрация пользователей по введеной в поле фильтрации информации
function filterData(filterQuery, userData) {
    filterQuery = filterQuery.toLowerCase() // принимаем введенные в поле фильтрации данные и приводим к нижнему регистру

    if (!filterQuery) { // если поле фильтрации пустое, то мы возвращаем всех пользователей
        return userData
    }

    return userData.filter((user) => { // фильтруем пользователей используя метод строки "startsWith"
        const fullName = (user.name.first + ' ' + user.name.last).toLowerCase() // приводим полное имя пользователя к нижнему регистру и добавляем между ними пробел
        return fullName.startsWith(filterQuery) // сравниваем с данными, введенными в поле фильтрации
    })
}

// функция, проверяющая состояние загрузки пользователей с сервера - если идет загрузка, то скрываем таблицу, отключаем ввод в поле фильтрации
function setFetchingView(isFetching) {
    if (isFetching) {
        searchInput.setAttribute('disabled', 'disabled')
        contentTableElem.style.display = 'none'
        contentDataElem.insertAdjacentHTML('afterbegin', renderPreloader())
    } else {
        searchInput.removeAttribute('disabled')
        const loadingBlock = document.getElementById('preloader')
        loadingBlock.remove()
    }
}


// функция, добавляющая экземпляр пользователя
function instantiateUserElement(user) {
    const userData = prepareUserData(user) // принимаем подготовленные данные одного пользователя
    usersListElem.insertAdjacentHTML('afterbegin', renderUser(userData)) // добавляем данные в DOM
}

// функция, собирающая данные об одном пользователе
function prepareUserData(user) {
    const regDate = user.registered.date
    const newFormatDate = new Date(regDate).toLocaleDateString() // приводим дату к нужному формату

    return {
        name: user.name.first + ' ' + user.name.last,
        picture: user.picture.thumbnail,
        tooltipPicture: user.picture.large,
        location: user.location.state + ', ' + user.location.city,
        email: user.email,
        phone: user.phone,
        regDate: newFormatDate,
    }
}

// функция фильтрации введенных в input данных
function getFilterQuery() {
    const ignoreSymbolsRegex = /\p{P}+/gui // regex, необходимый для удаления всех знаков пунктуации
    const splitRegex = /\s+/gui // regex, необходимый для деления введенных данных
    const rawFilterQuery = searchInput.value // данные из поля фильтрации
    const filterQueryArray = rawFilterQuery.replace(ignoreSymbolsRegex, '').split(splitRegex).filter(x => x) // удаляем все знаки пунктуации, образуем массив (делитель - пробел), удаляем все пробелы

    let filterQuery = "" // готовая строка с валидными данными для поиска
    for (let i = 0; i < filterQueryArray.length; i++) { // добавляем каждое образованное ранее слово к строке (filterQuery), если слово не последнее, то добавляем пробел
        filterQuery += filterQueryArray[i]
        if (i + 1 < filterQueryArray.length) {
            filterQuery += " "
        }
    }
    return filterQuery
}

//функция удаления данных из поля фильтрации и заново рисующая всех пользователей
function clearSearchInput() {
    searchInput.value = ''
    drawUserData(userData)
}

// функция "Debounce" - при вводе в поле фильтрации если имеется задержка -
// коллбэк не сработает (не чаще чем раз в 2 секунды), однако, после таймаута функция все же выполнится с новыми данными из поля фильтрации
const filterUsersDebounce = debounce(() => {
    const filterQuery = getFilterQuery()
    const filtratedUsers = filterData(filterQuery, userData)
    drawUserData(filtratedUsers)
}, 2000)


function handleChangeSearchInput() {
    filterUsersDebounce()
}


document.addEventListener('DOMContentLoaded', loadData)
searchInput.addEventListener('input', handleChangeSearchInput)
buttonClear.addEventListener('click', clearSearchInput)