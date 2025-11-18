document.addEventListener('DOMContentLoaded', () =>
{
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('id');
    
  
    if (!taskId)
    {
        window.location.href = '404.html';
        return;
    }

   
    const taskList = new TaskList();
    const task = taskList.getTaskById(taskId);
    
    
    if (!task)
    {
        window.location.href = '404.html';
        return;
    }

   
    const editTitleEl = document.getElementById('editTitle');
    const editDescriptionEl = document.getElementById('editDescription');
    
   
    if (editTitleEl) editTitleEl.value = task.getTitle();
    if (editDescriptionEl) editDescriptionEl.value = task.getDescription();

    const editTaskForm = document.getElementById('editTaskForm');
    
   
    if (editTaskForm)
    {
        editTaskForm.addEventListener('submit', (e) =>
        {
            e.preventDefault();
            
           
            const title = editTitleEl ? editTitleEl.value : '';
            const description = editDescriptionEl ? editDescriptionEl.value : '';
            
            const titleError = document.getElementById('editTitleError');
            const descriptionError = document.getElementById('editDescriptionError');
            
        
            if (titleError) titleError.textContent = '';
            if (descriptionError) descriptionError.textContent = '';

            let isValid = true;

           
            if (!Validator.validateTitle(title))
            {
                if (titleError)
                {
                    titleError.textContent = 'Название должно содержать минимум 2 слова, не может состоять только из чисел';
                }
                isValid = false;
            }

           
            if (!Validator.validateDescription(description, title))
            {
                if (descriptionError)
                {
                    descriptionError.textContent = 'Описание должно содержать минимум 1 слово и не совпадать с названием';
                }
                isValid = false;
            }

          
            if (isValid)
            {
                taskList.updateTask(taskId, title.trim(), description.trim());
                window.location.href = 'index.html';
            }
        });
    }
});