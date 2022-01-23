const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});


const checkbox = document.getElementById("type");
const shopType = document.getElementById("shopType");
const typeCheck = document.getElementById("typeCheck");


checkbox.addEventListener("click", () => {

	if(typeCheck.checked){
		shopType.style.display = "block";
	}else{
		shopType.style.display = "none";
	}
});
