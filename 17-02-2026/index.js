const form = document.getElementById('form');
const uname = document.getElementById('uname');
const email = document.getElementById('email');
const password = document.getElementById('password');
const cpass=document.getElementById('cpassword');
form.addEventListener('submit',(e)=>{
    e.preventDefault()
    // using to avoid default things
    validate()
})

function validate(){
    let namevalue = uname.value.trim()
    let emailvalue = email.value.trim()
    let passwordvalue = password.value.trim()
    let cpassvalue = cpass.value.trim()

    if(namevalue===' '){
        setError(uname,'user is empty')
    }
    else if(namevalue.length<4){
        setError(uname,'username should ne more than 4 characters')
    }
    else{
        setSuccess(uname)
    }



    if(emailvalue===''){
        setError(email,'email is empty')
    }
    else if(!emailcheck(emailvalue)){
        setError(email,'enter valid email')
    }
    else{
        setSuccess(email)
    }


    if(passwordvalue===''){
        setError(password,'password is empty')
    }
    else if(passwordvalue.length<8){
        setError(password,' password should be minimum 8 characters')
    }
    else{
        setSuccess(password)
    }



    if(cpassvalue===''){
        setError(cpass,'password is empty')
    }
    else if(cpassvalue !==passwordvalue){
        setError(cpass,'password not matched')
    }
    else{
        setSuccess(cpass)
    }


    function setError(input,message){
        let parent = input.parentElement;
        let small=parent.querySelector('small')
        small.innerText=message
        parent.classList.add('error')
        parent.classList.remove('success')
    }

    function setSuccess(input,message){
        let parent=input.parentElement;
        let small = parent.querySelector('small')
        parent.classList.add('success')
        parent.classList.remove('error')
    }

    function emailcheck(input){
        let emailreg = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
        let valid = emailreg.test(input)
        return valid
    }
}
