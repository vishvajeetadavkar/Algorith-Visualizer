function create_navbar_options(text) {
  let sort_option = document.createElement("div");
  sort_option.textContent = text;
  sort_option.classList.add("navbar_option");
  return sort_option;
}

function get_sorting_navbar() {
  let top_navbar = document.createElement("div");
  top_navbar.id = "topnavbar";

  top_navbar.appendChild(create_navbar_options("Bubble Sort"));
  top_navbar.appendChild(create_navbar_options("Insertion Sort"));
  top_navbar.appendChild(create_navbar_options("Merge Sort"));
  return top_navbar;
}
export { get_sorting_navbar };
