renderMoney = () => {
  if (/https:\/\/www\.amazon\.co\.jp/.test(location.href)) {
    renderForAmazon()
  } else if (/https:\/\/[a-z]+\.rakuten\.co\.jp/.test(location.href)) {
    renderForRakuten()
  }
}

const renderForAmazon = () => {
  Array.from(document.querySelectorAll('span.a-size-base, span.a-color-price'), e => {
    if (e.textContent.indexOf('￥') > -1) {
      const price = extractPrice(e.textContent)
      const moneies = countMonies(price)

      var div = document.createElement('div')
      div.classList.add('money-sense-container')

      Object.keys(moneies).forEach(m => {
        for (let index = 0; index < moneies[m]; index++) {
          var img = document.createElement('img')
          img.classList.add('money-sense-icon')
          img.src = chrome.extension.getURL(`icons/${m}.png`)
          div.appendChild(img)
        }
      })

      e.parentNode.appendChild(div)
    }
  })
}

const renderForRakuten = () => {
  Array.from(document.querySelectorAll('span.important, span.price'), e => {
    if (/[0-9,]+/.test(e.textContent)) {
      const price = extractPrice(e.textContent)
      const moneies = countMonies(price)

      var div = document.createElement('div')
      div.classList.add('money-sense-container')

      Object.keys(moneies).forEach(m => {
        for (let index = 0; index < moneies[m]; index++) {
          var img = document.createElement('img')
          img.classList.add('money-sense-icon')
          img.src = chrome.extension.getURL(`icons/${m}.png`)
          div.appendChild(img)
        }
      })

      e.parentNode.appendChild(div)
    }
  })
}

// extract price from DOM string
const extractPrice = priceString => parseInt(priceString.match(/[0-9,]+/g)[0].replace(',', ''))

// count the number of notes and coins
const countMonies = price => ({
  ichimanYen: Math.floor(price / 10000),
  gosenYen: price % 10000 >= 5000 ? 1 : 0,
  senYen: Math.floor((price % 5000) / 1000),
  gohyakuYen: price % 1000 >= 500 ? 1 : 0,
  hyakuYen: Math.floor((price % 500) / 100),
  gojyuYen: price % 100 >= 50 ? 1 : 0,
  jyuYen: Math.floor((price % 50) / 10),
  goYen: price % 10 >= 5 ? 1 : 0,
  ichiYen: Math.floor(price % 5)
})

window.onload = renderMoney
setInterval(() => {
  url !== location.href && renderMoney()
  url = location.href
}, 1000)
let url = location.href