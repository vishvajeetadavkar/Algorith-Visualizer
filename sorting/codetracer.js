let code_tracer_div;
function get_panel() {
  code_tracer_div = document.createElement("div");
  code_tracer_div.id = "code_trace_panel";
  return code_tracer_div;
}
function get_psuedocode_div(psuedocode) {
  let div = document.createElement("div");
  div.textContent = psuedocode;
  div.classList.add("psuedocode");
  return div;
}
function indent(arr, factor = 1) {
  let psuedocode_div_array = Array.from(
    document.querySelectorAll(".psuedocode")
  );
  for (let i = 0; i < arr.length; i++) {
    psuedocode_div_array[i].style["margin-left"] = factor * arr[i] + "vmin";
  }
}
//this takes an array of strings, which will be different for every sorting algorithm
function populate_psuedocode(arr) {
  for (const psuedocode of arr) {
    let psuedocode_div = get_psuedocode_div(psuedocode);
    code_tracer_div.appendChild(psuedocode_div);
  }
}

export { get_panel, populate_psuedocode, indent };
