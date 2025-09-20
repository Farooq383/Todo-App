document.addEventListener('DOMContentLoaded', () => {
const taskinput=document.getElementById('task-input');
const addtaskbtn=document.getElementById("add-task-btn");
const tasklist=document.getElementById("task-list");
const emptyimage=document.querySelector(".empty-image");
const todoscontainer=document.querySelector(".todos-container");
const progressbar=document.getElementById("progress");
const progressnumber=document.getElementById("numbers");




const toggleEmptystate=()=>{
    emptyimage.style.display=tasklist.children.length===0 ? "block" : "none";
    todoscontainer.style.width=tasklist.children.length > 0 ? "100%" : "50%";
}


const updateProgress=(checkcompletion = true)=>{
    const   totaltasks=tasklist.children.length;
    const completedtask=tasklist.querySelectorAll(".checkbox:checked").length;
    progressnumber.style.width=totaltasks ? `${(completedtask/totaltasks)*100}%` : "0%";
    progressnumber.textContent=`${completedtask} / ${totaltasks}`;
    
    if(checkcompletion && totaltasks> 0 && completedtask === totaltasks){
        Confetti();
    }
}


const savetasksTolocalstorage=()=>{
    const tasks=Array.from(tasklist.querySelectorAll("li")).map(li => ({
        text:li.querySelector("span").textContent,
        completed:li.querySelector(".checkbox").checked
    }))
    localStorage.setItem("tasks",JSON.stringify(tasks))
}


const loadtasksfromlocalstorage=()=>{
    const savedtasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedtasks.forEach(({text,completed})=>addtask(text,completed,false));
    toggleEmptystate();
    updateProgress()
}

const addtask=(text,completed = false,
    checkcompletion = true)=>{
    // e.preventDefault();
const tasktext = text || taskinput.value.trim();
if(!tasktext){
    return;
}
const li=document.createElement("li");
li.innerHTML=`
<input type="checkbox" class="checkbox" ${completed ? "checked" : ""}/>
<span> ${tasktext} </span>
<div class="task-btn">
<button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
<button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
</div>
`;

const checkbox=li.querySelector(".checkbox");
const editbtn=li.querySelector(".edit-btn");


if(completed){
    li.classList.add("completed");
    editbtn.disabled=true;
    editbtn.style.opacity="0.5";
    editbtn.style.pointerEvents="none";
}

checkbox.addEventListener("change",()=>{
    const isChecked=checkbox.checked;
    li.classList.toggle("completed",isChecked);
    editbtn.disabled=isChecked;
    editbtn.style.opacity=isChecked ? "0.5" : "1";
    editbtn.style.pointerEvents=isChecked ? "none" : "auto";
    updateProgress();
    savetasksTolocalstorage();
    
})



editbtn.addEventListener("click", () => {
    if(!checkbox.checked){
        taskinput.value=li.querySelector("span").textContent
        li.remove();
        toggleEmptystate();
        updateProgress(false);
        savetasksTolocalstorage();
    }
    
    })


const deletebtn=li.querySelector(".delete-btn").addEventListener("click", ()=>{
    li.remove();
    toggleEmptystate();
    updateProgress();
})


// li.textContent=tasktext;
tasklist.appendChild(li);
taskinput.value="";
toggleEmptystate();
updateProgress(checkcompletion);
}

addtaskbtn.addEventListener("click",()=>
    addtask());
taskinput.addEventListener("keydown",(e)=>{
    if(e.key === "Enter"){
        e.preventDefault();
    addtask();
    }
})



loadtasksfromlocalstorage();



});


const Confetti=()=>{
    const count = 200,
  defaults = {
    origin: { y: 0.7 },
  };

function fire(particleRatio, opts) {
  confetti(
    Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio),
    })
  );
}

fire(0.25, {
  spread: 26,
  startVelocity: 55,
});

fire(0.2, {
  spread: 60,
});

fire(0.35, {
  spread: 100,
  decay: 0.91,
  scalar: 0.8,
});

fire(0.1, {
  spread: 120,
  startVelocity: 25,
  decay: 0.92,
  scalar: 1.2,
});

fire(0.1, {
  spread: 120,
  startVelocity: 45,
});
}