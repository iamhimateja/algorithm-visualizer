function Algorithm(type, strategy) {
  this.type = type;
  this.strategy = strategy;
  this.dataSetSize = document.getElementById("dataset_size").value || 20
  this.title = this.strategy + " " + this.type

  this.getSpeed = function () {
    return parseInt(document.getElementById("speed").dataset.seconds)
  }

  this.delay = async (speed) => {
    return new Promise(resolve =>
      setTimeout(() => {
        resolve();
      }, speed)
    );
  }

  this.disableInputs = function () { 
    document.querySelectorAll("#elToFind, .algorithm_link, #generate, #dataset_size, #search_button, #sort").forEach(element => {
      switch (element.tagName.toLowerCase()) {
        case "a":
          element.classList.add("disabled")
          break;
        case "button":
        case "input":
          element.setAttribute("disabled", true)
          break;
      }
    })
  }

  this.enableInputs = function () { 
    document.querySelectorAll("#elToFind, .algorithm_link, #generate, #dataset_size, #search_button, #sort").forEach(element => {
      switch (element.tagName.toLowerCase()) {
        case "a":
          element.classList.remove("disabled")
          break;
        case "button":
        case "input":
          element.removeAttribute('disabled')
          break;
      }
    })
  }

  this.generateRandomDataSet = function (size) {
    let dataset = []
    for (let i = 0; i < size; i++) {
      let newElem = Math.floor(Math.random() * 500) + 5
      while (dataset.lastIndexOf(newElem) !== -1) {
        newElem = Math.floor(Math.random() * 500) + 5
      }
      dataset.push(newElem)
    }
    return (this.title == "Binary Search") ? dataset.sort(function (a, b) { return a - b }) : dataset;
  }

  this.dataset = this.generateRandomDataSet(this.dataSetSize)

  this.program = function () {
    switch (this.title) {
      case "Linear Search":
        return [
          "function linearSearch(arr, elToFind) {",
          "  for (let i=0; i < arr.length; i++) {",
          "    if (arr[i] == elToFind) {",
          "      return i;",
          "    }",
          "  }",
          "  return null;",
          "}"
        ]
      case "Binary Search":
        return [
          "function binarySearch(sortedArray, elToFind) {",
          "  let lowIndex = 0;",
          "  let highIndex = sortedArray.length - 1;",
          "  while (lowIndex <= highIndex) {",
          "    let midIndex = Math.floor((lowIndex + highIndex) / 2);",
          "    if (sortedArray[midIndex] == elToFind) {",
          "      return midIndex;",
          "    } else if (sortedArray[midIndex] < elToFind) {",
          "      lowIndex = midIndex + 1;",
          "    } else {",
          "      highIndex = midIndex - 1;",
          "    }",
          "  }",
          "  return null;",
          "}"
        ]
      case "Selection Sort":
        return [
          "let selectionSort = (arr) => {",
          "  let len = arr.length;",
          "  for (let i = 0; i < len; i++) {",
          "    let min = i;",
          "    for (let j = i + 1; j < len; j++) {",
          "      if (arr[min] > arr[j]) {",
          "        min = j;",
          "      }",
          "    }",
          "    if (min !== i) {",
          "      let tmp = arr[i];",
          "      arr[i] = arr[min];",
          "      arr[min] = tmp;",
          "    }",
          "  }",
          "  return arr;",
          "}"
        ]
      case "Bubble Sort":
        return [
          "let bubbleSort = (inputArr) => {",
          "  let len = inputArr.length;",
          "  for (let i = 0; i < len; i++) {",
          "    for (let j = 0; j < len; j++) {",
          "      if (inputArr[j] > inputArr[j + 1]) {",
          "        let tmp = inputArr[j];",
          "        inputArr[j] = inputArr[j + 1];",
          "        inputArr[j + 1] = tmp;",
          "      }",
          "    }",
          "  }",
          "  return inputArr;",
          "};"
        ]
    }
  }

  this.find = function (element) {
    this.disableInputs()
    document.getElementById("result").innerHTML = "Searching..."
    switch (this.title) {
      case "Linear Search":
        let linear_search_index = 0;
        let found = false;
        document.getElementById("result").innerHTML = ""
        let linearSearchInterval = setInterval(() => {
          codeHighlight(3)
          document.querySelector(".array_elem[data-value='" + this.dataset[linear_search_index] + "']").classList.add('highlight')
          if (this.dataset[linear_search_index] == element) {
            codeHighlight(4)
            document.querySelector(".array_elem[data-value='" + this.dataset[linear_search_index] + "']").classList.add('found')
            document.getElementById("result").innerHTML = "The searched element <span class='searchedElement'>" + element + "</span> found at index <span class='searchIndex'>" + linear_search_index + "</span>";
            found = true
            this.enableInputs()
            clearInterval(linearSearchInterval)
          } else {
            document.querySelector(".array_elem[data-value='" + this.dataset[linear_search_index] + "']").classList.add('completed')
            document.getElementById("search_button").removeAttribute("disabled")
          }
          if (linear_search_index == this.dataset.length - 1) {
            clearInterval(linearSearchInterval)
            if (!found) {
              codeHighlight(7)
              this.enableInputs()
              document.getElementById("result").innerHTML = "The searched element <span class='searchedElement notFound'>" + element + "</span> not found in the array";
            }
          } else {
            linear_search_index++
          }
        }, this.getSpeed());
        break;
      case "Binary Search":
        let lowIndex = 0;
        let highIndex = this.dataset.length - 1;
        document.querySelector(".array_elem[data-index='" + lowIndex + "']").setAttribute("data-search-index", 'low')
        document.querySelector(".array_elem[data-index='" + highIndex + "']").setAttribute("data-search-index", 'high')
        document.getElementById("result").innerHTML = ""
        let binarySearchInterval = setInterval(() => {
          codeHighlight(4)
          if (lowIndex <= highIndex) {
            codeHighlight(5)

            let midIndex = Math.floor((lowIndex + highIndex) / 2);

            document.querySelectorAll(".array_elem[data-search-index='mid']").forEach((element) => element.removeAttribute("data-search-index"))
            document.querySelector(".array_elem[data-index='" + midIndex + "']").setAttribute("data-search-index", 'mid')

            if (this.dataset[midIndex] == element) {
              codeHighlight(7)
              document.querySelector(".array_elem[data-value='" + this.dataset[midIndex] + "']").classList.add('found')
              document.getElementById("result").innerHTML = "The searched element <span class='searchedElement'>" + element + "</span> found at index <span class='searchIndex'>" + midIndex + "</span>";
              document.getElementById("search_button").removeAttribute("disabled")
              clearInterval(binarySearchInterval)
              this.enableInputs()
            } else if (this.dataset[midIndex] < element) {
              codeHighlight(9)
              lowIndex = midIndex + 1;
              document.querySelectorAll(".array_elem[data-search-index='low']").forEach((element) => element.removeAttribute("data-search-index"))
              document.querySelector(".array_elem[data-index='" + lowIndex + "']").setAttribute("data-search-index", 'low')
              for (let c_index = 0; c_index < lowIndex; c_index++) {
                document.querySelectorAll(".array_elem[data-index='" + c_index + "']").forEach((c_element) => c_element.classList.add("completed"))
              }
            } else {
              codeHighlight(11)
              highIndex = midIndex - 1;
              document.querySelectorAll(".array_elem[data-search-index='high']").forEach((element) => element.removeAttribute("data-search-index"))
              document.querySelector(".array_elem[data-index='" + highIndex + "']").setAttribute("data-search-index", 'high')
              for (let c_index = midIndex + 1; c_index < highIndex; c_index++) {
                document.querySelectorAll(".array_elem[data-index='" + c_index + "']").forEach((c_element) => c_element.classList.add("completed"))
              }
              if (highIndex < (this.dataset.length - 1)) {
                for (let c_index = highIndex + 1; c_index < this.dataset.length; c_index++) {
                  document.querySelectorAll(".array_elem[data-index='" + c_index + "']").forEach((c_element) => c_element.classList.add("completed"))
                }
              }
            }
          } else {
            clearInterval(binarySearchInterval)
            codeHighlight(14)
            this.enableInputs()
            document.getElementById("result").innerHTML = "The searched element <span class='searchedElement notFound'>" + element + "</span> not found in the array";
          }
        }, this.getSpeed());
        break;
    }
  }

  this.sort = async () => {
    this.disableInputs()
    document.getElementById("result").innerHTML = "Sorting..."
    let barElements = document.querySelectorAll('.bars .bar')
    switch (this.title) {
      case "Selection Sort":
        codeHighlight(3)
        for (let index1 = 0; index1 < this.dataset.length; index1++) {
          codeHighlight(4)
          let min = index1;
          codeHighlight(5)
          for (let index2 = index1 + 1; index2 < this.dataset.length; index2++) {
            document.querySelectorAll('.bar:not(.min)').forEach((element) => element.classList.remove('highlighted'))
            barElements[index2].classList.add("highlighted")
            await this.delay(this.getSpeed() / 2)
            codeHighlight(6)
            if (this.dataset[min] > this.dataset[index2]) {
              codeHighlight(7)
              min = index2
              document.querySelectorAll('.bar.min').forEach((element) => element.className = 'bar')
              barElements[min].className += " highlighted min"
            }
          }

          codeHighlight(10)
          if (min !== index1) {
            codeHighlight(11)
            let tmp = this.dataset[index1];
            codeHighlight(12)
            this.dataset[index1] = this.dataset[min];
            codeHighlight(13)
            this.dataset[min] = tmp;
            loadBars(this.dataset, false, false)
            barElements = document.querySelectorAll('.bars .bar')
          }

          for (let index = 0; index <= index1 ; index++) {
            barElements[index].classList.add("completed")
          }

          if (index1 == this.dataset.length - 1) {
            codeHighlight(16)
            barElements.forEach((element) => element.classList.add('completed'))
            document.getElementById("result").innerHTML = "The data is sorted.";
          }
        }
        break;
      case "Bubble Sort":
        codeHighlight(3)
        for (let index1 = 0; index1 < this.dataset.length - 1; index1++) {
          codeHighlight(4)
          for (let index2 = 0; index2 < (this.dataset.length - index1) - 1; index2++) {
            codeHighlight(5)
            barElements.forEach((element) => element.classList.remove('highlighted'))
            barElements[index2].classList.add('highlighted')
            barElements[index2 + 1].classList.add('highlighted')

            await this.delay(this.getSpeed() / 2)

            if (this.dataset[index2] > this.dataset[index2 + 1]) {
              codeHighlight(6)
              let tmp = this.dataset[index2];
              codeHighlight(7)
              this.dataset[index2] = this.dataset[index2 + 1];
              codeHighlight(8)
              this.dataset[index2 + 1] = tmp;
              let previous_bar = document.querySelectorAll('.bar.completed')
              let previous_completed_value
              if (previous_bar.length > 0) previous_completed_value = previous_bar[0].dataset.value
              loadBars(this.dataset, false, false, false)
              barElements = document.querySelectorAll('.bars .bar')
              if (previous_completed_value) {
                let previous_comlpeted_index = document.querySelector('.bar[data-value="' + Number(previous_completed_value) + '"]').dataset.index
                for (let index = previous_comlpeted_index; index < this.dataset.length; index++) {
                  barElements[index].classList.add('completed')
                }
              }
            }
          }
          for (let index = (barElements.length - index1 - 1); index < this.dataset.length; index++) {
            barElements[index].classList.add('completed')
          }

          if (index1 == this.dataset.length - 2) {
            codeHighlight(12)
            barElements.forEach((element) => element.classList.add('completed'))
            document.getElementById("result").innerHTML = "The data is sorted.";
          }
        }
        break;
    }

    this.enableInputs()
  }

  this.data = function () {
    return {
      type: this.type,
      title: this.title,
      dataset: this.dataset,
      program: this.program()
    }
  }
}

function codeHighlight(lineNo) {
  document.querySelectorAll("#code_block .highlight").forEach((element) => element.classList.remove('highlight'))
  document.querySelector("#code_block [data-line-number='" + lineNo + "']").classList.add('highlight')
}

function loadArray(array) {
  let array_wrap = document.querySelector(".array_wrap");
  array_wrap.innerHTML = ""
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    let arrayElemDiv = document.createElement("div");
    arrayElemDiv.className += "array_elem";
    arrayElemDiv.setAttribute("data-value", element)
    arrayElemDiv.setAttribute("data-index", index)
    arrayElemDiv.setAttribute("data-search-index", "")
    let arrayElem = document.createTextNode(element);
    arrayElemDiv.appendChild(arrayElem);
    array_wrap.appendChild(arrayElemDiv)
  }
}

function loadBars(array, animate, currentIndex, bubbleSortIndex) {
  let bar_lines_wrap = document.querySelector(".bars");
  bar_lines_wrap.innerHTML = ""
  bar_lines_wrap.classList.remove('hide')
  if (animate) {
    bar_lines_wrap.classList.add("animate")
  } else {
    bar_lines_wrap.classList.remove("animate")
  }
  let maxElem = Math.max(...array)
  let barMargin = 5;
  let barWrapPadding = 20 + 20; // left + right
  let barWidth = (bar_lines_wrap.offsetWidth - barWrapPadding - array.length * barMargin) / array.length
  for (let i = 0; i < array.length; i++) {
    element = array[i]
    let barElemDiv = document.createElement("div");
    let barPercentageValue = barPercentage(element, maxElem)
    barElemDiv.setAttribute("data-value", element)
    barElemDiv.setAttribute("data-index", i)
    barElemDiv.classList.add("bar")
    if (animate) barElemDiv.classList.add("bar_hide")

    if (array.length < 25) barElemDiv.classList.add("psuedo_horizantal")
    if (barPercentageValue < 15) barElemDiv.classList.add("psuedo_on_top")

    barElemDiv.style.setProperty("--bar-width", barWidth + "px")
    barElemDiv.style.setProperty("--bar-height", barPercentageValue + "%")
    if (animate) barElemDiv.style.setProperty("--animation-delay", (i * 5) + "ms")
    bar_lines_wrap.appendChild(barElemDiv)
    if (animate) {
      setTimeout(() => {
        for (const barElement of document.querySelectorAll(".bar.bar_hide")) {
          barElement.classList.remove("bar_hide")
        }
      }, ((i * 8) + 500)); // animation delay + animation duration
    }
  }

  if (currentIndex) {
    for (let index = 0; index <= currentIndex; index++) {
      document.querySelector(".bar[data-index='" + index + "']").className += ' completed forced'
    }
  }

  if (bubbleSortIndex) {
    if (bubbleSortIndex[1] == (array.length - 1)) {
      let barElements = document.querySelectorAll('.bars .bar')
      for (let index = (barElements.length - bubbleSortIndex[0] - 1); index < array.length; index++) {
        barElements[index].className += ' completed forced'
      }
    }
  }
}

function barPercentage(partialValue, totalValue) {
  return (100 * partialValue) / totalValue;
}

function loadData() {
  let algorithm = new Algorithm(window.currentAlgData.algType, window.currentAlgData.strategy)
  window.currentAlgorithm = algorithm;
  let algorithm_data = algorithm.data()
  let array_wrap = document.getElementsByClassName("array_wrap")[0];
  let bar_lines_wrap = document.getElementsByClassName("bars")[0];
  array_wrap.innerHTML = ""
  bar_lines_wrap.innerHTML = ""
  if (algorithm_data.type == "Sort") {
    loadBars(currentAlgorithm.dataset, true, false)
  } else {
    bar_lines_wrap.classList.add("hide")
    loadArray(currentAlgorithm.dataset)
  }

  let code_block = document.querySelector("#code_block")
  code_block.innerHTML = ""
  for (let index = 0; index < algorithm_data.program.length; index++) {
    const element = algorithm_data.program[index];
    let codeLine = document.createElement("div");
    codeLine.setAttribute("data-line-number", index + 1)
    codeLine.classList.add("code_line")
    let code_content = document.createTextNode(element);
    codeLine.appendChild(code_content);
    code_block.appendChild(codeLine)
  }
}

window.addEventListener("load", function () {

  let algorithm_links = document.getElementsByClassName("algorithm_link")

  for (let i = 0; i < algorithm_links.length; i++) {
    const element = algorithm_links[i];

    element.addEventListener("click", function (event) {
      event.preventDefault();
      $this = this
      document.querySelectorAll(".algorithm_link").forEach((element) => element.classList.remove("active"))
      element.classList.add('active')

      window.currentAlgData = {
        algType: this.dataset.algType,
        strategy: this.dataset.strategy
      }
      document.getElementById("result").innerHTML = ''
      if (this.dataset.algType != "Search") {
        document.getElementById("sort").classList.remove('hide')
        document.querySelector(".search_form").classList.add('hide')
      } else {
        document.getElementById("sort").classList.add('hide')
        document.querySelector(".search_form").classList.remove('hide')
      }

      document.getElementById("code_wrap").classList.add("minimized")

      document.querySelectorAll(".algorithm_name").forEach((element) => element.innerText = ($this.dataset.strategy + " " + $this.dataset.algType))
      document.querySelector('.visual_area').classList.add((this.dataset.strategy + "_" + this.dataset.algType).toLowerCase())
      document.getElementById("generate").click()
    })
  }

  document.getElementById("generate").addEventListener("click", loadData, false);

  document.getElementById("dataset_size").addEventListener("keyup", function (event) {
    event.preventDefault()
    if (this.value > 100) {
      this.value = 100
    }
    if (event.keyCode == 13) {
      document.getElementById("generate").click()
    }
  });

  document.getElementById("elToFind").addEventListener("keyup", function (event) {
    event.preventDefault()
    if (event.keyCode == 13) {
      document.getElementById("search_button").click()
    }
  });

  document.getElementById("search_button").addEventListener("click", function (event) {
    event.preventDefault()
    let elToFind = document.getElementById("elToFind").value
    document.querySelectorAll(".array_elem").forEach((element) => {
      element.classList.remove("found")
      element.classList.remove("completed")
      element.classList.remove("highlight")
    })
    currentAlgorithm.find(elToFind)
  })

  document.getElementById("speed").addEventListener("click", function (event) {
    switch (this.innerText) {
      case "1×":
        this.innerText = "2×"
        this.setAttribute("data-seconds", 1000 / 2)
        break;
      case "2×":
        this.innerText = "5×"
        this.setAttribute("data-seconds", 1000 / 5)
        break;
      case "5×":
        this.innerText = "10×"
        this.setAttribute("data-seconds", 1000 / 10)
        break;
      case "10×":
        this.innerText = "1×"
        this.setAttribute("data-seconds", 1000)
        break;
    }
  })

  document.querySelector(".resizer").addEventListener("click", function (event) {
    if (this.parentElement.classList.contains("minimized")) {
      this.parentElement.classList.remove("minimized")
    } else {
      this.parentElement.classList.add("minimized")
    }
  });

  document.getElementById("sort").addEventListener("click", function (event) {
    event.preventDefault()
    currentAlgorithm.sort()
  })

  algorithm_links[0].click();
})
