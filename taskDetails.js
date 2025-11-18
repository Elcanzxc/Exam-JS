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

    const detailsContainer = document.getElementById('taskDetails');
    

    if (detailsContainer)
    {
        detailsContainer.textContent = '';

        
        const createDetailItem = (label, value, valueClass = null) =>
        {
            const wrapper = document.createElement('div');
            wrapper.classList.add('detail-item');
            wrapper.style.marginBottom = '15px'; 

            const labelEl = document.createElement('strong');
            labelEl.textContent = label + ': ';
            
            const valueEl = document.createElement('span');
            valueEl.textContent = value;
            if (valueClass)
            {
                valueEl.classList.add(valueClass);
            }

            wrapper.appendChild(labelEl);
            wrapper.appendChild(valueEl);
            return wrapper;
        };

        
        const titleEl = document.createElement('h2');
        titleEl.textContent = task.getTitle();
        titleEl.style.marginBottom = '20px';
        detailsContainer.appendChild(titleEl);

       
        const idRow = createDetailItem('ID', task.getId());
        detailsContainer.appendChild(idRow);

 
        const descLabel = document.createElement('strong');
        descLabel.textContent = 'Описание:';
        detailsContainer.appendChild(descLabel);

        const descText = document.createElement('p');
        descText.textContent = task.getDescription();
        descText.style.marginTop = '5px';
        descText.style.marginBottom = '15px';
        descText.style.whiteSpace = 'pre-wrap'; 
        detailsContainer.appendChild(descText);

       
        const dateRow = createDetailItem('Дата создания', task.getCreatedAt());
        detailsContainer.appendChild(dateRow);


        const statusText = task.isCompleted() ? 'Выполнено' : 'В процессе';
        const statusRow = document.createElement('div');
        statusRow.style.marginTop = '10px';
        
        const statusLabel = document.createElement('strong');
        statusLabel.textContent = 'Статус: ';
        
        const statusValue = document.createElement('span');
        statusValue.textContent = statusText;
        
        
        if (task.isCompleted())
        {
            statusValue.style.color = 'green';
            statusValue.style.fontWeight = 'bold';
        }
        else
        {
            statusValue.style.color = '#d9534f'; 
        }

        statusRow.appendChild(statusLabel);
        statusRow.appendChild(statusValue);
        detailsContainer.appendChild(statusRow);
    }
});