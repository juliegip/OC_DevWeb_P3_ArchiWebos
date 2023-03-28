const loginAsAdmin = function(e) {
    e.preventDefault();
    
const loginDetails = {
    email: e.target.querySelector("[name=email]").value,
    password: e.target.querySelector("[name=password]").value
        };
    console.log("LoginDetails  :",loginDetails);

    fetch("http://localhost:5678/api/users/login", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(loginDetails)
    })
           .then(r => {
                if (r.ok) {
                    return r.json()
                
                } else {
                    throw new Error ("Erreur dans l’identifiant ou le mot de passe");
                }
            })
            .then(data => {
                    console.log("le token est:",data.token)
                    window.sessionStorage.setItem("token",data.token);
                    window.location.href = "index.html";
            })
            .catch(error => {
                console.error(error);
                const errorElement = document.querySelector("p.msg-error");
                errorElement.textContent ="Erreur dans l’identifiant ou le mot de passe";
            }); 
           
    }       

const checkbtn = document.getElementById("form-id");
if(checkbtn) {
    checkbtn.addEventListener("submit",loginAsAdmin);
}else {
        console.error("The element form-id does not exist");
    };



        /* function logout
         function adminMode */