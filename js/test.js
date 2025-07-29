const main = function () {
  console.log(1)
}

const second = function () {
  let a = 0
  for (let i = 0; i < 1000000; i++) {
    a += i
  }
  console.log(a)
}

function checkTime(func) {
  return function () {
    const startTime = performance.now()
    func()
    console.log(`Время работы функции ${func.name}: ${performance.now() - startTime}мс`)
  }
}

let funciyaObertka = checkTime(main)
funciyaObertka()

funciyaObertka = checkTime(second)
funciyaObertka()
