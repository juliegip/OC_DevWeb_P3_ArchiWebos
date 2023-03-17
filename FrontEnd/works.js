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
const buttonFilters = document.querySelectorAll(".btn-filter");

buttonFilters.forEach(function(selectedFilter){
    selectedFilter.addEventListener("click", function () {
            buttonFilters.forEach((element)=> {
                element.classList.remove("btn-selected");
            });
            selectedFilter.classList.add("btn-selected");
            const filterCategoryName = selectedFilter.textContent;
            const filteredprojects = works.filter(function(work) {
                        return work.category.name === filterCategoryName; 
                        
            });
            document.querySelector(".gallery").innerHTML = "";
            generateWorks(filteredprojects);
        });
    })

    const resetFilter = document.querySelector(".resetfilter");
    console.log(resetFilter.textContent);
    resetFilter.addEventListener("click", function () {
            document.querySelector(".gallery").innerHTML = "";
            generateWorks(works);
        });