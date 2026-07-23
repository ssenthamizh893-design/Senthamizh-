let tasks = JSON.parse(localStorage.getItem("tasks")) || [

function saveTasks(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(filter="all"){
    const list = document.getElementById("taskList");
    list.innerHTML="";

    tasks.forEach((task,index)=>{
        if(filter==="active" && task.completed) return;
        if(filter==="completed" && !task.completed) return;

        const li=document.createElement("li");

        li.innerHTML=`
        <span class="${task.completed?'completed':''}"
        onclick="toggleTask(${index})">
        ${task.text}
        </span>

        <button onclick="editTask(${index})">Edit</button>
        <button onclick="deleteTask(${index})">Delete</button>
        `;

        list.appendChild(li);
    });
}

function addTask(){
    const input=document.getElementById("taskInput");

    if(input.value.trim()==="") return;

    tasks.push({
        text:input.value,
        completed:false
    });

    input.value="";
    saveTasks();
    renderTasks();
}

function toggleTask(index){
    tasks[index].completed=!tasks[index].completed;
    saveTasks();
    renderTasks();
}

function editTask(index){
    const newTask=prompt("Edit Task",tasks[index].text);

    if(newTask!==null){
        tasks[index].text=newTask;
        saveTasks();
        renderTasks();
    }
}

function deleteTask(index){
    tasks.splice(index,1);
    saveTasks();
    renderTasks();
}

function filterTasks(type){
    renderTasks(type);
}

renderTasks();