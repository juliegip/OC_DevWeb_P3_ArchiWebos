let works = window.localStorage.getItem("works");

const response = await fetch ('http://localhost:5678/api/works');
works = await response.json();
const valeurWorks = JSON.stringify(works);

console.log(works);

function generateWorks(works) {
    for (let i=0 ; i< works.length; i++) {

const projet = works[i];
const sectionGallery  = document.querySelector(".gallery");
//Création d'une balise dédiée à un projet
const elementProjet = document.createElement("figure");
elementProjet.dataset.id = works[i].id;

// Création des balises d'un projet
const caption = document.createElement("figcaption");
caption.innerText = projet.title;
const image = document.createElement("img");
image.src = projet.imageUrl;

// Rattachement de la balise projet à la section Gallery
sectionGallery.appendChild(elementProjet);

// Rattachement des éléments d'un projet
elementProjet.appendChild(image);
elementProjet.appendChild(caption);

}
};

generateWorks(works);


// Gestion des filtres 
const SelectFiltre = document.querySelectorAll(".btn-filter");
    SelectFiltre.forEach(function(filtre){
        filtre.addEventListener("click", function () {
            const filtreCategoryName = filtre.textContent;
            const filteredprojects = works.filter(function(work) {
                        return work.category.name === filtreCategoryName; 
                        
            });
            document.querySelector(".gallery").innerHTML = "";
            generateWorks(filteredprojects);
        });
    })

    const SelectTous = document.querySelector(".resetfilter");
    console.log(SelectTous.textContent);
        SelectTous.addEventListener("click", function () {
            document.querySelector(".gallery").innerHTML = "";
            generateWorks(works);
        });