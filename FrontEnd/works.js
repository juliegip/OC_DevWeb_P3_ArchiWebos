let token = window.sessionStorage.getItem("token");
if (token !== undefined && token!== null) {
    adminMode()}

const urlAPI = 'http://localhost:5678/api/works'
const urlAPICat = 'http://localhost:5678/api/categories'
const mainGallery  = document.querySelector(".gallery");
const modalGallery  = document.querySelector(".modal-gallery");

let works = window.localStorage.getItem("works");
    if (works === null) {
        const response = await fetch (urlAPI);
        works = await response.json();
        const dataworks = JSON.stringify(works);
        window.localStorage.setItem("works",dataworks)
    
}
    else {
        works = JSON.parse(works)
        
    };

let cat = window.localStorage.getItem("cat");
    if (cat === null){
        const response = await fetch(urlAPICat);
        cat = await response.json();
        const datacat = JSON.stringify(cat);
        window.localStorage.setItem("cat",datacat)
    } else {
        cat = JSON.parse(cat)
    };
 
// Affichage de la galerie des projets
function generateWorks(works) {
    for (let i=0 ; i< works.length; i++) {
        const projet = works[i];
        const elementProjet = document.createElement("figure");
        elementProjet.dataset.id = works[i].id;
        const caption = document.createElement("figcaption");
        caption.innerText = projet.title;
        const image = document.createElement("img");
        image.src = projet.imageUrl;
        mainGallery.appendChild(elementProjet);
        elementProjet.appendChild(image);
        elementProjet.appendChild(caption);
    };
};


// Gestion du mode admin
    // Affichage des éléments admin 
function adminMode(){
    const adminElements = document.querySelectorAll(".admin-elements");
        adminElements.forEach(function(e) {
            e.classList.add("show-as-admin");
            e.classList.remove("admin-elements")
        });
    const loginMenu = document.getElementById("login-menu");
    loginMenu.remove();
    const divFilter = document.querySelector(".filter");
    divFilter.classList.add("js-hide")
    };


    // Fonction pour se déconnecter en tant qu'admin
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

};


// Gestion des filtres 
const cleanGallery = function() {
    while (mainGallery.firstChild) {
        mainGallery.firstChild.remove()
    };
};
const resetFilter = function(worksFiltered) {
    cleanGallery();
    generateWorks(worksFiltered);
};

const btnFilter = document.querySelectorAll(".btn-filter");
btnFilter.forEach(btn =>{btn.addEventListener("click",filterGallery)});
document.querySelector(".resetfilter").addEventListener("click",() => resetFilter(works));

function filterGallery(event) {     
    btnFilter.forEach(btn => {
    btn.classList.remove("btn-selected");
  });
    event.target.classList.add("btn-selected");
    const filterCategoryName = event.target.textContent;
    const worksFiltered = works.filter(function(work){
        return work.category.name === filterCategoryName;
    });

    resetFilter(worksFiltered);
};


// Gestion de la fenêtre modale        
let modal = null
    // Ouvrir la fenêtre modale
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
};

    // Ferme la fenetre modale
const closeModal = function (e){
    e.preventDefault()
    viewModalMain();
    cleanGallery();
    resetForm();
    generateWorks(works);

    if (modal == null) return

    modal.style.display = "none";
    modal.setAttribute("aria-hidden","true");
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click",closeModal);
    modal.querySelector(".js-modal-close").removeEventListener("click",closeModal);
    modal.querySelector(".js-modal-back").removeEventListener("click",viewModalMain);
    modal.querySelector(".js-modal-stop").removeEventListener("click",stopPropagation);

    modal = null
};

const stopPropagation = function (e) {
    e.stopPropagation();
};


// Gestion des différentes vues de la modale : (vue Galerie Photos, vue Ajout Photos)
    // Vue Galerie Photos de la modale
function viewModalMain(){
    const toHideAdd = document.querySelectorAll(".modal-add");
        toHideAdd.forEach(element => (element.classList.add("js-hide")))
    const toHideMain = document.querySelector(".modal-main");
        toHideMain.classList.remove("js-hide")
    const arrowReturn = document.querySelector(".fa-arrow-left-long")
        arrowReturn.style.opacity = 0.01
    resetForm();
};  

    // Vue du formulaire d'ajout de nouveau projet dans la modale
function viewModalAdd() {

    const toHideAdd = document.querySelectorAll(".modal-add");
        toHideAdd.forEach(element => (element.classList.remove("js-hide")))
    const toHideMain = document.querySelector(".modal-main");
        toHideMain.classList.add("js-hide");
    const arrowReturn = document.querySelector(".fa-arrow-left-long")
        arrowReturn.style.opacity = 1;
    
    const inputPhoto = document.getElementById("input-photo")
        inputPhoto.addEventListener("change",previewimg)   
    
        document.getElementById("form-addProject").addEventListener("change",checkForm)

    const form = document.getElementById("form-addProject")
        form.addEventListener("submit",addProject);
        
};

// Gestion de l'affichage de la galerie dans la modale 
    // Affichage de la galerie photos de la modale
function generateWorksInModal() {

    while (modalGallery.firstChild) {
        modalGallery.firstChild.remove()}

    for (let i=0 ; i< works.length; i++) {
        const projet = works[i];
        const elementProjet = document.createElement("figure");
        elementProjet.dataset.id = works[i].id;
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
        modalGallery.appendChild(elementProjet);
        iconContainer.appendChild(iconArrow);
        iconContainer.appendChild(iconTrash)
        elementProjet.appendChild(iconContainer);
        elementProjet.appendChild(image);
        elementProjet.appendChild(caption);
}};

// Fonctionnalités Admin : ajout, suppresion de projet 
// Supprimer un projet :
function deleteProject(projectId,figure) {

    let index = works.findIndex(function(element){
        return element.id == projectId;
    })

    fetch(`${urlAPI}/${projectId}`,{
        method:"DELETE",
        headers: { 
            "Authorization":`Bearer ${token}`}
    })
    .then(res=>{
        if (res.ok) {
            figure.remove();
        const msgDeleteProject = document.querySelector("p.msg-delete");
        msgDeleteProject.textContent =`Projet ${projectId} supprimé`;
        setTimeout(() => { msgDeleteProject.textContent=""}, 2000); 
        works.splice(index,1)
    } else {
        const msgDeleteProject = document.querySelector("p.msg-delete");
        msgDeleteProject.textContent =`Le projet n'a pas été supprimé`;
    }
    return res;
    })
    .catch(error => console.log(error));
};

// Gestion du formulaire d'ajout de projet
    // Bloque l'envoi du formulaire si tous les éléments ne sont pas remplis
function checkForm(){
    const inputPhoto = document.getElementById("input-photo")
    const inputTitre = document.getElementById("titre")
    const btnValider = document.getElementById("valider")

    if (inputTitre.value && inputPhoto.value) {
        btnValider.style.backgroundColor = "#1d6154";
        btnValider.disabled = false;
    } else {
        btnValider.disabled = true;
        btnValider.style.backgroundColor = "";
    }
}

    // Remet le formulaire à zero
function resetForm(){
    const formreset = document.getElementById("form-addProject")
    formreset.reset()
    const preview = document.getElementById('preview');
    preview.src = "";

    const hideicon = document.querySelector(".fa-image");
    hideicon.classList.remove("js-hide")
    hideicon.classList.add("fa-regular")
    const hideLabel = document.getElementById("label-input-photo");
    hideLabel.classList.remove("js-hide")
    hideLabel.classList.add("label-input-photo")
    const hideP = document.querySelector(".grey p");
    hideP.classList.remove("js-hide")
    const btnValider = document.getElementById("valider")
    btnValider.disabled = true;
    btnValider.style.backgroundColor = "";
};
    // Prévisualise la photo sélectionnée du projet à ajouter
function previewimg(){       
    const preview = document.getElementById('preview');
    const file = this.files[0];
    const fileSize = this.files[0].size;
    if (fileSize >= 4194304){
        const msgAlert = document.querySelector("p.msg-alert");
        msgAlert.textContent = "Impossible d'ajouter la photo. Fichier trop volumineux"
        file.value="";
    
    } else {
        const hideicon = document.querySelector(".fa-image");
        hideicon.classList.add("js-hide")
        hideicon.classList.remove("fa-regular")
        const hideLabel = document.getElementById("label-input-photo");
        hideLabel.classList.add("js-hide")
        hideLabel.classList.remove("label-input-photo")
        const hideP = document.querySelector(".grey p");
        hideP.classList.add("js-hide")
    
        const reader = new FileReader();
        reader.addEventListener("load", function(){
        preview.src = reader.result;
        });
        if (file){reader.readAsDataURL(file);}
    }
};

// Fonction -> Ajouter un projet :
class newProject {
    constructor (imageUrl,titre,categorie) {
        this.imageUrl = imageUrl
        this.title = titre
        const category = cat.find((c) => c.id === categorie)
        this.category = category
    }
}

async function addProject(e) {
    e.preventDefault();
    
    const newImg = document.getElementById("input-photo").files[0];
   
    const titre = document.getElementById("titre").value;
    const categorie = parseInt(document.getElementById("categorie").value);
  
    const formdata = new FormData();
      formdata.append("image", newImg);
      formdata.append("title", titre);
      formdata.append("category", categorie);

    await fetch(`${urlAPI}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formdata,
      })
      .then(res => {
            if (res.ok) {
                const msgSuccess = document.querySelector("p.msg-success")
                msgSuccess.textContent =`Le projet ${titre} a été ajouté!`       
                setTimeout(() => { msgSuccess.classList.add("js-hide")},2000)  
                
                const reader = new FileReader();
                reader.onload = function() {
                    const imageDataUrl = reader.result
                    const toAddToWorks = new newProject(imageDataUrl, titre, categorie);
                    works.push(toAddToWorks)
                };
                reader.readAsDataURL(newImg)
           
                setTimeout(()=> {closeModal(e)},2100) ;

            }else{

                const msgFailed = document.querySelector("p.msg-failed")
                msgFailed.textContent =`Le projet ${titre} n'a pas pu être ajouté!`   
            }
            return res;       


        })
       .catch(error => console.log("error",error));  
           
    resetForm();
};
  

// Code
generateWorks(works)
console.log("token",token)

document.querySelectorAll(".js-modal").forEach(a=> {
    a.addEventListener("click",openModal)
});

window.addEventListener("keydown",function(e){
    if(e.key === "Escape" || e.key ==="Esc") {
        closeModal(e)
    }
});

document.getElementById("logout-menu").addEventListener("click",logOut);

window.onbeforeunload = function() {
    window.localStorage.clear();
    sessionStorage.removeItem("token");
};