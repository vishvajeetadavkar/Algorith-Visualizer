const ARRAY_SORTED_COLOR = "green";
const ELEMENT_HIGHLIGHT_COLOR = "green";
const DEFAULT_ELEMENT_COLOR = "blue";
const QUICKSORT_PIVOT_COLOR = "yellow";
const PSUEDOCDE_HIGHLIGHT_COLOR = "pink";
const POSITIVE_ASSERTION_COLOR = "brwon";
const NEGATIVE_ASSERION_COLOR = "violet";
import { populate_psuedocode, indent } from "./codetracer.js";
function get_location(node, char = "") {
  let temp = d3.select(node).attr("transform");
  let x_location = +temp.slice(10, temp.indexOf(","));
  let y_location = +temp.slice(temp.indexOf(",") + 1, -1);
  if (char === "x") return +x_location;
  if (char === "y") return +y_location;
  return { x: x_location, y: y_location };
}
function swap_bars(node1, node2, time_duration) {
  const bar1 = d3.select(node1);
  const bar2 = d3.select(node2);
  const bar1_location = get_location(node1);
  const bar2_location = get_location(node2);

  return Promise.all([
    bar1
      .transition()
      .duration(time_duration)
      .attr("transform", `translate(${bar2_location.x},${bar1_location.y})`)
      .end(),

    bar2
      .transition()
      .duration(time_duration)
      .attr("transform", `translate(${bar1_location.x},${bar2_location.y})`)
      .end(),
  ]);
}
// this functions chains two animations together, first the coloring
//then decoloring(background:none)
function highlight_psuedocode(node, duration = 200, color) {
  const psuedocode = d3.select(node);
  return psuedocode
    .transition()
    .duration(duration)
    .style("background", color)
    .end()
    .then(() =>
      psuedocode
        .transition()
        .duration(duration)
        .style("background", "none")
        .end()
    );
}
function fill_in_range(start_index, end_index, color, time_duration) {
  return d3
    .selectAll(
      `svg g:nth-child(n+${start_index + 1}):nth-child(-n+${end_index + 1
      }) rect`
    )
    .transition()
    .style("fill", color)
    .duration(time_duration)
    .end();
}
function translate_in_range(arr, time_duration, factor) {
  let transitions_array = [];
  for (let i = 0; i < arr.length; i++) {
    const temp_node = arr[i].node;
    let location = get_location(temp_node);
    transitions_array.push(
      d3
        .select(temp_node)
        .transition()
        .duration(time_duration)
        .attr(
          "transform",
          `translate(${location.x},${location.y - 15 * factor})`
        )
        .end()
    );
  }
  return Promise.all(transitions_array);
}
function translate_into_sorted(arr, color, time_duration, factor) {
  const sorted_array = [...arr].sort((element1, element2) => {
    return element1.value - element2.value;
  });
  let p = [];
  for (let index = 0; index < arr.length; index++) {
    const sorted_index = sorted_array.findIndex((object) =>
      object.node.isEqualNode(arr[index].node)
    );
    p.push(
      Promise.all([
        d3
          .select(arr[index].node)
          .transition()
          .duration(time_duration)
          .attr(
            "transform",
            "translate" +
            `(${get_location(arr[sorted_index].node, "x")},${get_location(arr[index].node, "y") - 15 * factor
            })`
          )
          .style("fill", color)
          .end(),
        d3
          .select(arr[index].node.firstElementChild)
          .transition()
          .duration(time_duration)
          .style("fill", color),
      ])
    );
  }
  return Promise.all(p);
}

function bubble_sort(arr, time_duration) 
{
  let animations_array = [];
  let psuedocode_text_arr = [
    "do",
    "swapped = false",
    "for i = 1 to indexOfLastUnsortedElement-1",
    "if leftElement > rightElement",
    "swap(leftElement, rightElement)",
    "swapped = true",
    "while swapped",
  ];
  populate_psuedocode(psuedocode_text_arr);

  //indents psuedocode on div, takes an array of indentation values
  //and an optional factor to indent by
  indent([0, 1, 1, 2, 3, 2, 0], 2);
  let psuedocode_node_arr = Array.from(
    document.querySelectorAll(".psuedocode")
  );
  let swap_occured;

  for (let i = 0; i < arr.length; i++) {
    swap_occured = false;
    animations_array.push(() => {
      return highlight_psuedocode(
        psuedocode_node_arr[1],
        time_duration,
        NEGATIVE_ASSERION_COLOR
      );
    });
    animations_array.push(() => {
      return highlight_psuedocode(
        psuedocode_node_arr[2],
        time_duration,
        PSUEDOCDE_HIGHLIGHT_COLOR
      );
    });
    for (let j = 0; j < arr.length - i - 1; j++) {
      //temp variables required to pass by value, not reference

      let temp1 = arr[j],
        temp2 = arr[j + 1];

      //push highlighting animation
      if (arr[j].value > arr[j + 1].value) {
        animations_array.push(() => {
          return highlight_psuedocode(
            psuedocode_node_arr[3],
            time_duration,
            POSITIVE_ASSERTION_COLOR
          );
        });
        animations_array.push(() => {
          return highlight_psuedocode(
            psuedocode_node_arr[4],
            time_duration,
            PSUEDOCDE_HIGHLIGHT_COLOR
          );
        });
        animations_array.push(() => {
          return d3
            .select(temp1.node.firstElementChild)
            .transition()
            .duration(time_duration)
            .style("fill", ELEMENT_HIGHLIGHT_COLOR)
            .end();
        });
      }
        if (arr[j].value > arr[j + 1].value) { 
          animations_array.push(() => {
            temp1.node.firstElementChild.style["fill"] =
              ELEMENT_HIGHLIGHT_COLOR;
          });

        animations_array.push(() => {
          return swap_bars(temp1.node, temp2.node, time_duration);
        });
        animations_array.push(() => {
          return highlight_psuedocode(
            psuedocode_node_arr[5],
            time_duration,
            PSUEDOCDE_HIGHLIGHT_COLOR
          );
        });
        //swap actual array

        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swap_occured = true;
      } else {
        animations_array.push(() => {
          return highlight_psuedocode(
            psuedocode_node_arr[3],
            time_duration,
            NEGATIVE_ASSERION_COLOR
          );
        });
        animations_array.push(() => {
          return d3
            .select(temp1.node.firstElementChild)
            .transition()
            .duration(0)
            .style("fill", DEFAULT_ELEMENT_COLOR)
            .end();
        });
      }
    }
    if (!swap_occured) break;
  }
  if (!swap_occured) {
    //at this point array is sorted, so push sort complete animation
    animations_array.push(() => {
      return d3
        .selectAll(".rect")
        .transition()
        .duration(1000)
        .style("fill", ARRAY_SORTED_COLOR)
        .end();
    });
  }


return animations_array;
}

function selection_sort(arr, time_duration) {
  let animations_array = [];
  let psuedocode_text_arr = [
    "for i=0 to length(Arr)",
    "Minimum_element  = Arr[0]",
    "for each unsorted element:",
    "if element < Minimum_element",
    "element = New_minimum",
    "swap (Minimum_element, first unsorted position)",
  ];
  populate_psuedocode(psuedocode_text_arr);
  indent([0, 1, 1, 2, 1, 1], 4);

  //indents psuedocode on div, takes an array of indentation values
  //and an optional factor to indent by
  let psuedocode_node_arr = Array.from(
    document.querySelectorAll(".psuedocode")
  );

  for (let i = 0; i <= arr.length - 1; i++) {
    // find the index of the smallest element
    let smallestIdx = i;
    let temp1 = arr[i];
    animations_array.push(() => {
      return d3
        .select(temp1.node.firstElementChild)
        .transition()
        .duration(time_duration)
        .style("fill", ELEMENT_HIGHLIGHT_COLOR)
        .end();
    });

    for (let j = i + 1; j <= arr.length - 1; j++) {

      if (arr[j].value < arr[smallestIdx].value) {
        smallestIdx = j
        let temp2 = arr[j]
        animations_array.push(() => {
          return d3
            .select(temp2.node.firstElementChild)
            .transition()
            .duration(time_duration)
            .style("fill", ELEMENT_HIGHLIGHT_COLOR)
            .end();
        });
      }
    }
    

    // if current iteration element isn't smallest swap it
    if (arr[i].value > arr[smallestIdx].value) {
      let temp2 = arr[smallestIdx];
      animations_array.push(() => {
        return swap_bars(temp1.node, temp2.node, time_duration);
      });
      let temp = arr[i]
      arr[i] = arr[smallestIdx]
      arr[smallestIdx] = temp
    }
    animations_array.push(() => {
      return d3
        .select(temp1.node.firstElementChild)
        .transition()
        .duration(time_duration)
        .style("fill", DEFAULT_ELEMENT_COLOR)
        .end();
    });
  }
  animations_array.push(() => {
    return d3
      .selectAll(".rect")
      .transition()
      .duration(1000)
      .style("fill", ARRAY_SORTED_COLOR)
      .end();
  });

  return animations_array;
}

function insertion_sort(arr, time_duration) {
  ;
  let animations_array = [];
  let psuedocode_text_arr = [
    "for i = 1 to n",
    "key = arr [i] ",
    "if subarray behind key is unsorted",
    "put the key element in its right place",
  ];
  populate_psuedocode(psuedocode_text_arr);
  indent([0, 1, 1, 2], 3);

  //indents psuedocode on div, takes an array of indentation values
  //and an optional factor to indent by
  let psuedocode_node_arr = Array.from(
    document.querySelectorAll(".psuedocode")
  );
  for (let i = 1; i < arr.length; i++) {
    let j = i;

    let temp = arr[j];
    animations_array.push(() => {
      return highlight_psuedocode(
        psuedocode_node_arr[1],
        time_duration,
        NEGATIVE_ASSERION_COLOR
      );
    });
    animations_array.push(() => {
      return highlight_psuedocode(
        psuedocode_node_arr[2],
        time_duration,
        PSUEDOCDE_HIGHLIGHT_COLOR
      );
    });

    animations_array.push(() => {
      return d3
        .select(temp.node.firstElementChild)
        .transition()
        .duration(time_duration)
        .style("fill", ELEMENT_HIGHLIGHT_COLOR)
        .end();
    });
    while (j > 0 && arr[j].value < arr[j - 1].value) {
      let temp = arr[j],
        temp2 = arr[j - 1];

      animations_array.push(() => {
        return highlight_psuedocode(
          psuedocode_node_arr[3],
          time_duration,
          POSITIVE_ASSERTION_COLOR
        );
      });
      animations_array.push(() => {
        return swap_bars(temp.node, temp2.node, time_duration);
      });

      arr[j] = arr[j - 1];
      arr[j - 1] = temp;
      j -= 1;
    }
    animations_array.push(() => {
      return highlight_psuedocode(
        psuedocode_node_arr[2],
        time_duration,
        PSUEDOCDE_HIGHLIGHT_COLOR
      );
    });
    animations_array.push(() => {
      return highlight_psuedocode(
        psuedocode_node_arr[4],
        time_duration,
        PSUEDOCDE_HIGHLIGHT_COLOR
      );
    });
    animations_array.push(() => {
      return d3
        .select(temp.node.firstElementChild)
        .transition()
        .duration(time_duration)
        .style("fill", DEFAULT_ELEMENT_COLOR)
        .end();
    });
  }
  animations_array.push(() => {
    return d3
      .selectAll(".rect")
      .transition()
      .duration(1000)
      .style("fill", ARRAY_SORTED_COLOR)
      .end();
  });

  return animations_array;
}

function Merge_sort(arr, time_duration) { 
  const color_array = [
    "GREEN",
    "GREEN",
    "BLUE",
    "YELLOW",
    "PINK",
    "BROWN",
    "VIOLET",
    "WHITE",
  ];
  let psuedocode_text_arr = [
    "if not single element array",
    "Consider the right part of the last array division",
    "Consider the left part of the last array division",
    "Merge the sorted arrays"

  ];
  populate_psuedocode(psuedocode_text_arr);
  indent([0,2,2], 2);
  let psuedocode_node_arr = Array.from(
    document.querySelectorAll(".psuedocode")
  );
  let animations_array = [];
  function merge(arr, l, m, r) {
    let n1 = m - l + 1;
    let n2 = r - m;

    let L = new Array(n1);
    let R = new Array(n2);
    for (let i = 0; i < n1; i++) L[i] = arr[l + i];
    for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    let i = 0;

    let j = 0;

    let k = l;
    while (i < n1 && j < n2) {
      if (L[i].value <= R[j].value) {
        arr[k] = L[i];
        i++;
      } else {
        arr[k] = R[j];
        j++;
      }
      k++;
    }
    while (i < n1) {
      arr[k] = L[i];
      i++;
      k++;
    }
    while (j < n2) {
      arr[k] = R[j];
      j++;
      k++;
    }
  }
  function mergeSort(arr, l, r, stack_count = 1) {
    if (l >= r) {
      animations_array.push(() => {
        return highlight_psuedocode(
          psuedocode_node_arr[0],
          time_duration,
          NEGATIVE_ASSERION_COLOR
        );
      });
      return; //returns recursively
    }
    else
    {
      animations_array.push(() => {
        return highlight_psuedocode(
          psuedocode_node_arr[0],
          time_duration,
          POSITIVE_ASSERTION_COLOR
        );
      });
    }
    let temp_arr = [...arr.slice(l, r + 1)];
    animations_array.push(() => {
      return Promise.all([
        fill_in_range(l, r, color_array[stack_count], time_duration),
        translate_in_range(temp_arr, time_duration, stack_count),
      ]);
    });

    let m = l + parseInt((r - l) / 2);
    animations_array.push(() => {
      return highlight_psuedocode(
        psuedocode_node_arr[1],
        time_duration,
        PSUEDOCDE_HIGHLIGHT_COLOR
      );
    });
    mergeSort(arr, l, m, stack_count + 1);
    animations_array.push(() => {
      return highlight_psuedocode(
        psuedocode_node_arr[2],
        time_duration,
        PSUEDOCDE_HIGHLIGHT_COLOR
      );
    });
    mergeSort(arr, m + 1, r, stack_count + 1);
    temp_arr = [...arr.slice(l, r + 1)];
    animations_array.push(() => {
      return highlight_psuedocode(
        psuedocode_node_arr[3],
        time_duration,
        PSUEDOCDE_HIGHLIGHT_COLOR
      );
    });
    merge(arr, l, m, r);
    animations_array.push(() => {
      return translate_into_sorted(
        temp_arr,
        color_array[stack_count - 1],
        time_duration,
        -stack_count
      );
    });
  }
  mergeSort(arr, 0, arr.length - 1);
  animations_array.push(() => {
    return d3
      .selectAll(".rect")
      .transition()
      .duration(1000)
      .style("fill", ARRAY_SORTED_COLOR)
      .end();
  });
  return animations_array;
}
function quick_sort(arr, time_duration) {
  const animations_array = [];
  let psuedocode_text_arr = [
    "if not single element array",
    "Select last element as pivot",
    "Partition subarray to make pivot the middle element",
    "Perform quicksort on left subarray",
    "Perform quicksort on right subarray"
  ];
  populate_psuedocode(psuedocode_text_arr);

  //indents psuedocode on div, takes an array of indentation values
  //and an optional factor to indent by
  indent([0,2,2,2,2], 2);
  let psuedocode_node_arr = Array.from(
    document.querySelectorAll(".psuedocode")
  );
  function partition(arr, start, end) {
    const pivot_obj = arr[end];
    let pivotIndex = start;
    animations_array.push(() => {
      return d3
        .select(pivot_obj.node.firstElementChild)
        .transition()
        .duration(time_duration)
        .style("fill", QUICKSORT_PIVOT_COLOR)
        .end();
    });
    let pivotIndex_temp;
    for (let i = start; i < end; i++) {
      pivotIndex_temp = pivotIndex;
      const temp = arr[i];
      let pivot_temp = arr[pivotIndex];
      animations_array.push(() => {
        return d3
          .select(temp.node.firstElementChild)
          .transition()
          .duration(time_duration)
          .style("fill", ELEMENT_HIGHLIGHT_COLOR)
          .end();
      });
      if (temp.value < pivot_obj.value) {
        if (i !== pivotIndex)
          //error if i==pivotIndex_temp
          animations_array.push(() => {
            return swap_bars(temp.node, pivot_temp.node, time_duration);
          });
        [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]]; //swap
        pivotIndex++;
      }
      animations_array.push(() => {
        return d3
          .select(temp.node.firstElementChild)
          .transition()
          .duration(time_duration)
          .style("fill", DEFAULT_ELEMENT_COLOR)
          .end();
      });
    }
    let temp_node = arr[pivotIndex];
    animations_array.push(() => {
      return swap_bars(temp_node.node, pivot_obj.node, time_duration);
    });
    [arr[pivotIndex], arr[end]] = [arr[end], arr[pivotIndex]]; //swap
    animations_array.push(() => {
      return d3
        .select(pivot_obj.node.firstElementChild)
        .transition()
        .duration(time_duration)
        .style("fill", DEFAULT_ELEMENT_COLOR)
        .end();
    });

    return pivotIndex;
  }
  function quickSortRecursive(arr, start, end) {
    if (start >= end) {
      animations_array.push(() => {
        return highlight_psuedocode(
          psuedocode_node_arr[0],
          time_duration,
          NEGATIVE_ASSERION_COLOR
        );
      });
      return;
    }
    else
    {
      animations_array.push(() => {
        return highlight_psuedocode(
          psuedocode_node_arr[0],
          time_duration,
          POSITIVE_ASSERTION_COLOR
        );
      });
    }
    animations_array.push(() => {
      return highlight_psuedocode(
        psuedocode_node_arr[1],
        time_duration,
        PSUEDOCDE_HIGHLIGHT_COLOR
      );
    });
    animations_array.push(() => {
      return highlight_psuedocode(
        psuedocode_node_arr[2],
        time_duration,
        PSUEDOCDE_HIGHLIGHT_COLOR
      );
    });
    let index = partition(arr, start, end);
    animations_array.push(() => {
      return highlight_psuedocode(
        psuedocode_node_arr[3],
        time_duration,
        PSUEDOCDE_HIGHLIGHT_COLOR
      );
    });
    quickSortRecursive(arr, start, index - 1); //left half
    animations_array.push(() => {
      return highlight_psuedocode(
        psuedocode_node_arr[4],
        time_duration,
        PSUEDOCDE_HIGHLIGHT_COLOR
      );
    });
    quickSortRecursive(arr, index + 1, end); //right half
  }
  quickSortRecursive(arr, 0, arr.length - 1);
  animations_array.push(() => {
    return d3
      .selectAll(".rect")
      .transition()
      .duration(1000)
      .style("fill", ARRAY_SORTED_COLOR)
      .end();
  });
  return animations_array;
}
const SortingFunctions = [bubble_sort, insertion_sort, Merge_sort, selection_sort,quick_sort];
export { SortingFunctions };
