let tooltipElem // элемент tooltip
let tooltipImg // элемент картинки
let currentElem // текущий элемент ячейки

const usersListEl = document.getElementById('content-list') // получаем элемент, содержащий список пользователей, чтобы повесить обработчик

const setTooltip = (event) => {

    if (currentElem) return // если есть текущий элемент, то прекращаем работу функции

    let target = event.target.closest('td') // ищем ближайший элемент ячейки

    if (!target) return // если его нет, то прекращаем выполнение

    let tooltipData = target.dataset.tooltip // полчаем искомый атрибут у ячейки, если его нет, то прекращаем работу
    if (!tooltipData) return

    tooltipElem = document.createElement('div') // создаем tooltip
    tooltipImg = document.createElement('img') // создаем картинку
    tooltipImg.src = tooltipData // добавляем url из атрибута ячейки
    tooltipElem.appendChild(tooltipImg)
    tooltipElem.className = 'tooltip'
    document.body.appendChild(tooltipElem)

    // далее определяем отступы для туллтипа, чтобы он был рядом с ячейкой
    let coords = target.getBoundingClientRect()

    let left = coords.left + (target.offsetWidth - tooltipElem.offsetWidth) / 2
    if (left < 0) left = 0

    let top = coords.top - tooltipElem.offsetHeight - 5
    if (top < 0) {
        top = coords.top + target.offsetHeight + 5
    }

    tooltipElem.style.left = left + 'px'
    tooltipElem.style.top = top + 'px'

    currentElem = target // переопределяем текущий элемент
}

const removeTooltip = (event) => {

    if (!currentElem) return // если отсутсвует текущий элемент, то прекращаем работу функции

    let relatedTarget = event.relatedTarget // для события "mouseout" связанным элементом будет тот, на который перешел курсор мыши

    while (relatedTarget) { // проверяем находится ли курсор мыши внутри ячейки и если нужно поднимаеся по DOM - дереву, чтобы это проверить
        if (relatedTarget === currentElem) return
        relatedTarget = relatedTarget.parentNode
    }

    // если мы определили, что не внутри ячейки, то удаляем сам туллтип и текущий элемент
    // (необходим только для проверки как отдельная и семантически ясная сущность, в отличие от "tooltipElem")
    tooltipElem.remove()
    tooltipElem = null
    currentElem = null

}

usersListEl.addEventListener("mouseover", setTooltip) // событие которое вызывается в момент, когда курсор оказывается над элементом
usersListEl.addEventListener("mouseout", removeTooltip) // событие которое вызывается в момент, когда курсор уходит с элемента