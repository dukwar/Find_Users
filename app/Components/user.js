// функция возвращающая строку таблицы с данными одного пользователя
export default function renderUser({name, tooltipPicture, picture, location, email, phone, regDate}) {

    return `
        <tr>
        <td><p>${name}</p></td>
        <td data-tooltip='${tooltipPicture}'><img src=${picture} alt='user img'></td>
        <td><p>${location}</p></td>
        <td><p>${email}</p></td>
        <td><p>${phone}</p></td>
        <td><p>${regDate}</p></td>
        </tr>
        `
}