let token = window.sessionStorage.getItem("token");
if (token !== undefined && token!== null){
    adminMode()
};

function generateWorks(works) {
    for (let i=0 ; i< works.length; i++) {

        const projet = works[i];

        //Création d'une balise dédiée à un projet
        const elementProjet = document.createElement("figure");
        elementProjet.dataset.id = works[i].id;

        // Création des balises d'un projet
        const caption = document.createElement("figcaption");
        caption.innerText = projet.title;
        const image = document.createElement("img");
        image.src = projet.imageUrl;

        // Rattachement de la balise projet à la section Gallery
        mainGallery.appendChild(elementProjet);

        // Rattachement des éléments d'un projet
        elementProjet.appendChild(image);
        elementProjet.appendChild(caption);

}};

function adminMode(){

    const adminElements = document.querySelectorAll(".admin-elements");
        adminElements.forEach(function(e) {
            e.classList.add("show-as-admin");
            e.classList.remove("admin-elements")
        });
    const loginMenu = document.getElementById("login-menu");
    loginMenu.remove();
    };

function logOut(){
    const logOutElements = document.querySelectorAll(".show-as-admin");
        logOutElements.forEach(function(e){
            e.classList.remove("show-as-admin");
            e.classList.add("admin-elements")
        });
        const loginMenu = document.createElement("li");
        loginMenu.setAttribute("id","login-menu")
        const anchorLogin = document.createElement("a");
        anchorLogin.innerText = "login"
        anchorLogin.setAttribute("href","login.html")
        loginMenu.appendChild(anchorLogin);
        const thirdPlace = document.querySelectorAll("#menu li")[2];
        const listMenu = document.querySelector("#menu");
        listMenu.insertBefore(loginMenu,thirdPlace)

}


// Gestion des filtres 
function filterGallery(event) {
    btnFilter.forEach(btn => {
    btn.classList.remove("btn-selected");
  });
    event.target.classList.add("btn-selected");
    const filterCategoryName = event.target.textContent;
    const worksFiltered = works.filter(function(work){
        return work.category.name === filterCategoryName;
    });
    
    console.log(filterCategoryName);
    console.log(worksFiltered);
    resetFilter(worksFiltered);
}

const cleanGalery = function() {
    while (mainGallery.firstChild) {
        mainGallery.firstChild.remove()
    };
}
const resetFilter = function(worksFiltered) {
    cleanGalery();
    generateWorks(worksFiltered);
}

const btnFilter = document.querySelectorAll(".btn-filter");
btnFilter.forEach(btn =>{btn.addEventListener("click",filterGallery)});
document.querySelector(".resetfilter").addEventListener("click",() => resetFilter(works));



// Gestion de la fenêtre modale        
let modal = null

const openModal = function (e){
    e.preventDefault()
    const target = document.querySelector(e.target.getAttribute("href"))
    target.style.display = null;
    target.removeAttribute("aria-hidden");
    target.setAttribute("aria-modal",true);
    modal = target
    modal.addEventListener('click',closeModal);
    modal.querySelector(".js-modal-close").addEventListener("click",closeModal);
    modal.querySelector(".js-modal-stop").addEventListener("click",stopPropagation);
    generateWorksInModal(works);
}

const closeModal = function (e){
    if (modal == null) return
    e.preventDefault()
    modal.style.display = "none";
    modal.setAttribute("aria-hidden","true");
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click",closeModal);
    modal.querySelector(".js-modal-close").removeEventListener("click",closeModal);
    modal.querySelector(".js-modal-stop").removeEventListener("click",stopPropagation);
    modal = null
}

const stopPropagation = function (e) {
    e.stopPropagation();
}

// Gestion de la galerie dans la modale 

function generateWorksInModal(works) {
    
    while (modalGallery.firstChild) {
        modalGallery.firstChild.remove()}

    for (let i=0 ; i< works.length; i++) {

        const projet = works[i];

        //Création d'une balise dédiée à un projet
        const elementProjet = document.createElement("figure");
        elementProjet.dataset.id = works[i].id;

        // Création des balises d'un projet
        const iconContainer = document.createElement("div");
        iconContainer.classList.add("icon-container");
        iconContainer.innerHTML = `<i class="fa-solid fa-arrows-up-down-left-right"></i>
        <i class="fa-solid fa-trash-can"></i>`        
        const caption = document.createElement("figcaption");
        caption.innerText = "éditer"
        const image = document.createElement("img");
        image.src = projet.imageUrl;

        // Rattachement de la balise projet à la section Gallery
        modalGallery.appendChild(elementProjet);

        // Rattachement des éléments d'un projet
        elementProjet.appendChild(iconContainer)
        elementProjet.appendChild(image);
        elementProjet.appendChild(caption);

}};

const response = await fetch ('http://localhost:5678/api/works');
const works = await response.json();
const valeurWorks = JSON.stringify(works);

const mainGallery  = document.querySelector(".gallery");
const modalGallery  = document.querySelector(".modal-gallery");
console.log("works:", works);
generateWorks(works);

document.querySelectorAll(".js-modal").forEach(a=> {
    a.addEventListener("click",openModal)
});

window.addEventListener("keydown",function(e){
    if(e.key === "Escape" || e.key ==="Esc") {
        closeModal(e)
    }
});

document.getElementById("logout-menu").addEventListener("click",logOut);