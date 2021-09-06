// функция debounce
export default function debounce(func, ms) { // принимаем коллбэк и величину задержки

    let isCooldown = false, savedArgs // переменные содержащие состояние задержки и сохраненных данных из псевдомассива "arguments"


    return function() { // функция обертка, необходимая для замыкания

        if (isCooldown) { // если задержка в состоянии "true", то сохраняем данные из "arguments" в переменную и прекращаем дальнейшее выполнение
            savedArgs = arguments
            return
        }

        func.apply(this, arguments) // коллбэк (необязательно использовать apply, но так будет работать с методами объектов)

        isCooldown = true // переключаем состояние задержки

        // после таймаута переключаем состояние задержки и если обертка была выполнена во время таймаута (используем savedArgs, чтобы это проверить),
        // то выполняем коллбэк еще раз в после таймаута
        setTimeout(() => {
            isCooldown = false
            if (savedArgs) {
                func.apply(this, arguments)
                savedArgs = null
                isCooldown = false
            }
        }, ms)
    }
}