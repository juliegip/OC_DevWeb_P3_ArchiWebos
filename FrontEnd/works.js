
let token = window.sessionStorage.getItem("token");
if (token !== undefined && token!== null){
    adminMode()};

const urlAPI = 'http://localhost:5678/api/works'
const mainGallery  = document.querySelector(".gallery");
const modalGallery  = document.querySelector(".modal-gallery");

let works = [];

async function callAPI() {
    const response = await fetch (urlAPI);
    works = await response.json();
    generateWorks(works)
    console.log(works)
  }

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
     
        
};};


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
        sessionStorage.removeItem("token");
        
        window.location.href = "index.html";

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
    
    // console.log(filterCategoryName);
    // console.log(worksFiltered);
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
    // console.log(target);
    target.style.display = null;
    target.removeAttribute("aria-hidden");
    target.setAttribute("aria-modal",true);
    modal = target
    modal.addEventListener('click',closeModal);
    modal.querySelector(".js-modal-close").addEventListener("click",closeModal);
    modal.querySelector(".js-modal-back").addEventListener("click",viewModalMain);
    modal.querySelector(".js-modal-stop").addEventListener("click",stopPropagation);
    generateWorksInModal(works);

    const trashables = document.querySelectorAll(".fa-trash-can");
        trashables.forEach(function(icon){
            icon.addEventListener("click",function(){
                const figure = icon.closest("figure")
                const projectId = figure.getAttribute('data-id');           
                deleteProject(projectId,figure);
            })
        })

    const btnAjoutProjet = document.querySelector("#add-project");
        btnAjoutProjet.addEventListener("click",viewModalAdd)
    
        
}

const closeModal = function (e){
    e.preventDefault()
    viewModalMain();
    cleanGalery();
    callAPI();

    if (modal == null) return

    modal.style.display = "none";
    modal.setAttribute("aria-hidden","true");
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click",closeModal);
    modal.querySelector(".js-modal-close").removeEventListener("click",closeModal);
    modal.querySelector(".js-modal-back").removeEventListener("click",viewModalMain);
    modal.querySelector(".js-modal-stop").removeEventListener("click",stopPropagation);

    modal = null

   

}

const stopPropagation = function (e) {
    e.stopPropagation();
}

// Affichage dans la modale de la Galerie Photos

function viewModalMain(){
    const toHideAdd = document.querySelectorAll(".modal-add");
        toHideAdd.forEach(element => (element.classList.add("js-hide")))
    const toHideMain = document.querySelector(".modal-main");
        toHideMain.classList.remove("js-hide")
    const arrowReturn = document.querySelector(".fa-arrow-left-long")
        arrowReturn.style.opacity = 0.01
};  

// Affichage dans la modale de l'écran d'Ajouter Photo

function viewModalAdd() {
    const toHideAdd = document.querySelectorAll(".modal-add");
        toHideAdd.forEach(element => (element.classList.remove("js-hide")))
    const toHideMain = document.querySelector(".modal-main");
        toHideMain.classList.add("js-hide");
    const arrowReturn = document.querySelector(".fa-arrow-left-long")
        arrowReturn.style.opacity = 1;
    
    const projectToAddPhoto = document.getElementById("input-photo")
    projectToAddPhoto.addEventListener("change",previewimg)
    // console.log("projectToAddPhoto",projectToAddPhoto)
    
    const form = document.getElementById("form-addProject")
        form.addEventListener("submit",addProject);
        
};


// Gestion de la galerie dans la modale 

function generateWorksInModal() {

    while (modalGallery.firstChild) {
        modalGallery.firstChild.remove()}

    for (let i=0 ; i< works.length; i++) {
        const projet = works[i];

        //Création d'une balise dédiée à un projet
        const elementProjet = document.createElement("figure");
        elementProjet.dataset.id = works[i].id;

        // Création des balises d'un projet
        const iconContainer = document.createElement("div");
        iconContainer.classList.add("js-icon-container");
        const iconArrow = document.createElement("i");
        iconArrow.classList.add("fa-solid", "fa-arrows-up-down-left-right");
        const iconTrash = document.createElement("i");
        iconTrash.classList.add("fa-solid", "fa-trash-can");
  
        const caption = document.createElement("figcaption");
        caption.innerText = "éditer"
        const image = document.createElement("img");
        image.src = projet.imageUrl;
         
        // Rattachement de la balise projet à la section Gallery
        modalGallery.appendChild(elementProjet);

        
        //Rattachement des icons 
        iconContainer.appendChild(iconArrow);
        iconContainer.appendChild(iconTrash)

        // Rattachement des éléments d'un projet
        elementProjet.appendChild(iconContainer);
        elementProjet.appendChild(image);
        elementProjet.appendChild(caption);

}};

// Fonctionnalités Admin : ajout, suppresion de projet 
// Supprimer un projet :
function deleteProject(projectId,figure) {

    fetch(`${urlAPI}/${projectId}`,{
        method:"DELETE",
        headers: { 
            "Authorization":`Bearer ${token}`}
    })
    .then(res => {
        if (res.ok) {console.log(`Le projet ${projectId} a été supprimé`)}
        else {console.log(ERROR)}
        return res
    })
    .then(res =>console.log(res))
    .then(()=>{
        figure.remove();
        const msgDeleteProject = document.querySelector("p.msg-delete");
            msgDeleteProject.textContent =`Projet ${projectId} supprimé`
        setTimeout(() => { msgDeleteProject.classList.add("js-hide")
        }, 2000); 
       
    })
    .catch(error => console.log(error));
    console.log("works",works)  
};


// Ajouter un projet :
function previewimg(){
    const hideicon = document.querySelector(".fa-image");
    hideicon.classList.add("js-hide")
    const hideLabel = document.querySelector(".label-input-photo");
    hideLabel.classList.add("js-hide")
    const hideP = document.querySelector(".grey p");
    hideP.classList.add("js-hide")
        
    const preview = document.getElementById('preview');
    // while(preview.firstChild) {
    //     preview.removeChild(preview.firstChild)}
    const file = this.files[0];
    const reader = new FileReader();
    reader.addEventListener("load", function(){
        preview.src = reader.result;
    });

    if (file){
        reader.readAsDataURL(file);
    }
};

async function addProject(e) {
    e.preventDefault();
    
    const newImg = document.getElementById("input-photo").files[0];
    const titre = document.getElementById("titre").value;
    const categorie = parseInt(document.getElementById("categorie").value);
  
    const formdata = new FormData();
      formdata.append("image", newImg);
      formdata.append("title", titre);
      formdata.append("category", categorie);

      const resultat = await fetch(`${urlAPI}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formdata,
      })
      .then(res => {
            if (res.ok) {
            const msgSuccess = document.querySelector("p.msg-success")
            msgSuccess.textContent =`Nouveau projet ${titre} ajouté !`       
            setTimeout(() => { msgSuccess.classList.add("js-hide")},2000)
            }else{
                console.log("Le projet n'a pas pu être ajouté");
            }
            return res;
        })
       .catch(error => console.log("error",error));  
    
        const formreset = document.getElementById("form-addProject")
        formreset.reset()
        const preview = document.getElementById('preview');
        preview.src = "";

        const hideicon = document.querySelector(".fa-image");
        hideicon.createElement();
        const hideLabel = document.querySelector(".label-input-photo");
        hideLabel.remove()
        const hideP = document.querySelector(".grey p");
        hideP.remove();

       
       closeModal(e);

   
};
  

// Code

callAPI();


document.querySelectorAll(".js-modal").forEach(a=> {
    a.addEventListener("click",openModal)
});

window.addEventListener("keydown",function(e){
    if(e.key === "Escape" || e.key ==="Esc") {
        closeModal(e)
    }
});

document.getElementById("logout-menu").addEventListener("click",logOut);