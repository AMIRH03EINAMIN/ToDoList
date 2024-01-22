(function () {
    /*------------------------------|Global Variable|------------------------------*/

    let overlayDivElem = document.getElementById("overlay")
    let getTrElem = ""

    /*------------------------------|click overlay close|------------------------------*/

    document.getElementById("overlay").addEventListener("click", function(e){

        if (e.target.id ==="overlay") {

            modal_close()

        }

    })

    /*------------------------------|Event AddTask|------------------------------*/

    document.getElementById("addTask").addEventListener("click", function(){

        modal_maker(
            "Add Task",
            {
                mode:"input",
                content:[
                    {tag: "input", id:"title", type: "text", placeholder: "Title", eventHandler: "keyup", eventFunction: validation_title},
                    {tag: "input", id:"description", type: "text", placeholder: "Description", eventHandler: "keyup", eventFunction: validation_description},
                    {tag: "select", id:"priority", option: ["Low", "Medium", "High"]}
                ]
            },
            [
                {text: "OK", id: "ok", eventHandler:"click", eventFunction: modal_add_task_btn},
                {text: "Cancel", id: "cancel", eventHandler:"click", eventFunction: modal_close}
            ]
        )

    })

    /*------------------------------|Function modal_maker|------------------------------*/

    function modal_maker(header, body, footer){

        let bodyModalContent = ""
        let footerModalContent = ""

        // این قسمت با شرط متحوای بدنه مودال رو تعیین میکنه
        switch (body.mode) {
            case "input":
                body.content.forEach(function(item){
                    switch (item.tag) {

                        case "input":
                            bodyModalContent += `<label><input id=${item.id} type=${item.type} placeholder=${item.placeholder} required></label>`
                        break;

                        case "select":
                            let option = ""
                            item.option.forEach(function (optionVal){

                                option += `<option value=${optionVal}>${optionVal}</option>`

                            })
                            bodyModalContent += `<select id=${item.id}>${option}</select>`
                        break;
                    }
                })
            break;

            case "text":
                bodyModalContent = `<p>${body.content}</p>`
            break
        }

        // این قسمت دکمه های مودال رو میسازه
        footer.forEach(function(item){
            footerModalContent += `<button id=${item.id}>${item.text}</button>`
        })

        //این قسمت مودال رو میسازه
        overlayDivElem.innerHTML = 
        "<div class='modal'>"+
            "<div class='modal-header'>" + header + "<i class='fa-solid fa-xmark'></i> </div>" +
            "<div class='modal-body'>" + bodyModalContent  + "</div>" +
            "<div class='modal-footer'>" + footerModalContent + "</div>" 
        "</div>"

        //این حلقه به دکمه ها ایونت اضافه میکنه
        document.querySelector(".modal-footer").childNodes.forEach(function(item, index){
            item.addEventListener(footer[index].eventHandler, footer[index].eventFunction)
        })

        // این قسمت به دکمه ایکون ایونت اضافه میکنه
        document.querySelector(".modal-header i").addEventListener("click", function(){
            modal_close()
        })
        
        // این حلقه به اینپوت ها ایونت اضافه میکنه
        document.querySelector(".modal-body").childNodes.forEach(function(item, index){
            item.addEventListener(body.content[index].eventHandler, body.content[index].eventFunction)
        })

        // برای نمایش مودال
        overlayDivElem.style.display = "flex"
        overlayDivElem.classList.add("overlay-show")
        overlayDivElem.querySelector(".modal").classList.add("modal-show")

    }

    /*------------------------------|Function modal_add_task_btn|------------------------------*/

    // این تابع برای ایجاد تسک
    function modal_add_task_btn(){

        let titleInputElem = document.getElementById("title")
        let descriptionInputElem = document.getElementById("description")
        let labelTitleElem = titleInputElem.closest("label")
        let labelDescriptionElem = descriptionInputElem.closest("label")

        if(validation_input(titleInputElem, [{type:"empty"},{type:"string"},{type:"min", value:3}]) || validation_input(descriptionInputElem, [{type:"empty"},{type:"min", value:3}])){
            notification("not successful", "red")
        }
        else if(validation_input(titleInputElem, [{type:"empty"}])){
            notification("not successful", "red")
        }
        else if(validation_input(descriptionInputElem, [{type:"empty"}])){
            notification("not successful", "red")
        }
        else if(!labelTitleElem.hasAttribute("data-error") && !labelDescriptionElem.hasAttribute("data-error")){
            let prioritySelectElem = document.getElementById("priority")
            let tbodyElem = document.querySelector(".task-table tbody")
            let trRow = document.createElement("tr")

            trRow.innerHTML =
            "<tr>"+
                "<td>" + titleInputElem.value + "</td>"+
                "<td>" + descriptionInputElem.value + "</td>"+
                "<td>" + get_time() + "</td>"+
                "<td>" + prioritySelectElem .value + "</td>"+
                "<td><button class='edit-btn'><i class='fa-solid fa-pencil'></i></button><button class='delete-btn'><i class='fa-solid fa-trash'></i></button></td>"+
            "</tr>"

            tbodyElem.appendChild(trRow)

            // این قسمت به دکمه های ادیت و دیلیت ایونت میده
            trRow.getElementsByClassName("edit-btn")[0].addEventListener("click", function(){
                getTrElem = this.closest("tr")
                modal_maker(
                    "Edit Task",
                    {
                        mode:"text", 
                        content:"Are you sure??"
                    },
                    [
                        {text: "OK", id: "ok", eventHandler:"click", eventFunction: table_modal_edit_task_btn_confirm_btn},
                        {text: "Cancel", id: "cancel", eventHandler:"click", eventFunction: modal_close}
                    ],
        
                )
            })
            trRow.getElementsByClassName("delete-btn")[0].addEventListener("click", function(e){
                getTrElem = this.closest("tr")
                modal_maker(
                    "Delete Task",
                    {
                        mode:"text", 
                        content:"Are you sure??"
                    },
                    [
                        {text: "OK", id: "ok", eventHandler:"click", eventFunction: modal_delete_task_btn_confirm},
                        {text: "Cancel", id: "cancel", eventHandler:"click", eventFunction: modal_close}
                    ],
        
                )
            })

            modal_close()

            notification("Task added", "green")

        }

    }

    /*------------------------------|Function modal_close|------------------------------*/

    //تابع بستن مودال
    function modal_close(){

        overlayDivElem.classList.remove("overlay-show")
        overlayDivElem.querySelector(".modal").classList.remove("modal-show")

        setTimeout(function(){
            overlayDivElem.style.display = "none"
            overlayDivElem.innerHTML = ""
            overlayDivElem.classList.remove("overlay-show")
        },500)

    }

    /*------------------------------|Function modal_edit_task_btn_confirm|------------------------------*/

    // تابع انجام ادیت
    function modal_edit_task_btn_confirm(){

        let titleInputElem = document.getElementById("title")
        let descriptionInputElem = document.getElementById("description")
        let labelTitleElem = titleInputElem.closest("label")
        let labelDescriptionElem = descriptionInputElem.closest("label")
        let prioritySelectElem = document.getElementById("priority")

        if (!labelTitleElem.hasAttribute("data-error") && !labelDescriptionElem.hasAttribute("data-error")){

            getTrElem.getElementsByTagName("td")[0].innerHTML = titleInputElem.value
            getTrElem.getElementsByTagName("td")[1].innerHTML = descriptionInputElem.value
            getTrElem.getElementsByTagName("td")[2].innerHTML = get_time()
            getTrElem.getElementsByTagName("td")[3].innerHTML = prioritySelectElem.value

            modal_close()

            notification("Task edited", "green")

        }else{
            notification("not successful", "red")
        }

    }

    /*------------------------------|Function modal_delete_task_btn_confirm|------------------------------*/

    // تابع برای تایید دیلیت
    function modal_delete_task_btn_confirm(){

        getTrElem.closest("tr").remove()

        modal_close()

        notification("Task deleted", "green") 

    }

    /*------------------------------|Function table_modal_edit_task_btn_confirm_btn|------------------------------*/

    //تابع تایید ادیت
    function table_modal_edit_task_btn_confirm_btn(){
        
        modal_maker(
            "Edit Task",
            {
                mode:"input",
                content:[
                    {tag: "input", id:"title", type: "text", placeholder: "Title", eventHandler: "keyup", eventFunction: validation_title},
                    {tag: "input", id:"description", type: "text", placeholder: "Description", eventHandler: "keyup", eventFunction: validation_description},
                    {tag: "select", id:"priority", option: ["Low", "Medium", "High"]}
                ]
            },
            [
                {text: "OK", id: "ok", eventHandler:"click", eventFunction: modal_edit_task_btn_confirm},
                {text: "Cancel", id: "cancel", eventHandler:"click", eventFunction: modal_close}
            ]
        )

        document.getElementById("title").value = getTrElem.getElementsByTagName("td")[0].innerHTML
        document.getElementById("description").value = getTrElem.getElementsByTagName("td")[1].innerHTML
        document.getElementById("priority").value = getTrElem.getElementsByTagName("td")[3].innerHTML

    }

    /*------------------------------|Function get_time & doubleTime|------------------------------*/

    //تابع گرفتن زمان
    function get_time(){

        let getDate = new Date()
        let getHours = doubleTime(getDate.getHours())
        let getMinutes = doubleTime(getDate.getMinutes()) 
        let getSeconds = doubleTime(getDate.getSeconds())
        let time = getHours + ":" + getMinutes + ":" + getSeconds 

        //مقدار زمان رو برمیگردونه
        return time

    }

    //برای اضافه کردن صفر به اعداد زیر 10
    function doubleTime(timeVal){

        if (timeVal < 10){

            timeVal = "0" + timeVal

        }

        return timeVal;

    }

    /*------------------------------|Function notification|------------------------------*/

    function notification(notiContent, notiMode){

        let createLi = document.createElement("li")
        createLi.innerHTML = notiContent

        switch (notiMode) {

            case "red":
                createLi.classList.add("notification-red")
            break

            case "yellow":
                createLi.classList.add("notification-yellow")
            break

            case "green":
                createLi.classList.add("notification-green")                
            break

        }

        createLi.classList.add("notification-show")

        document.getElementById("notification").appendChild(createLi)
        setTimeout(function(){
            createLi.classList.remove("notification-show")
        },2500)
        
        setTimeout(function(){
            document.getElementById("notification").childNodes[0].remove()
        },3000)
    }
    
    /*------------------------------|Function validation|------------------------------*/

    function validation(data, validate){

        let errorContent = ""
        let pattern = ""

        for(let index = 0; index < validate.length; index++){
            switch (validate[index].type) {

                case "empty":
                    if (data === "") {
                        errorContent = "Please fill out this field"
                    }
                break

                case "string":
                    pattern = /^[a-zA-Zا-ی]*$/
                    if (!data.match(pattern)) {
                        errorContent = "Please enter letters"
                    }
                break

                case "mobile":
                    pattern = /09[0-9]{9}$/
                    if (!data.match(pattern)) {
                        errorContent = "Please enter mobile number"
                    }
                break

                case "integer":
                    pattern = /^[0-9]*$/
                    if (!data.match(pattern)) {
                        errorContent = "Please enter number"
                    }

                break
                case "min":
                    if (data.length <= validate[index].value) {
                        errorContent = "Your input must be more than " + validate[index].value
                    }
                break

                case "max":
                    if (data.length >= validate[index].value) {
                        errorContent = "Your input must be less than " + validate[index].value
                    }
                break

            }

            if(errorContent !== ""){
                break
            }

        }

        return errorContent

    }

    function validation_input(inputElem, validate){

        let labelGetAfter = inputElem.closest("label")
        let errorMessage = validation(inputElem.value, validate)

        if(errorMessage !== ""){
            labelGetAfter.setAttribute("data-error", errorMessage)
            return true
        }else{
            labelGetAfter.removeAttribute("data-error")
            return false
        }

    }

    function validation_title(e){

        validation_input(e.target,
         [
            {type:"empty"},
            {type:"string"},
            {type:"min", value:3}
        ])

    }

    function validation_description(e){

        validation_input(e.target,
         [
            {type:"empty"},
            {type:"min", value:3}
        ])

    }
    
})()

