const axios = require('axios');


let deletessigned = document.querySelectorAll('.btnDelete')
// let deleteTask = document.querySelector('#deleteTask');
let submitTask = document.querySelector('#submittask');


function deleteassign(){
    axios.post('/userTask',currenttask).then(res =>{
        console.log(currenttask)
        res.redirect('/userTask')
    })
}


function submitTask(){
    axios.post('/submittask').then(res =>{
        res.redirect('/userTask')
    })
}

submitTask.addEventListener('click',()=>{
    submitTask()
})



deletessigned.forEach((btn) => {
    btn.addEventListener('click',()=>{
        deleteassign()
        console.log(btn.value)
    })
    
});

