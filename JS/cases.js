
const __state = {
    failures: 0,
    current: 0,
    container: document.getElementById('text')
}

main()


function main(){
    fetch("./../JSON/exercises.json")
    .then((d) => d.json())
    .then((d) => phraseConstructor(d))
    .then((d) => setup(d))
    .then((d) => events(d))
}

function genusTag(genus){
    switch (genus) {
        case 'm':
            return `<mark class="tag">m</mark>`; 
            break;
        case 'f':
            return `<mark class="tag secondary">f</mark>`; 
            break;
        case 'n':
            return `<mark class="tag tertiary">n</mark>`; 
            break;
        default:
            return ``;
            break;
    }
}

function caseTag(grcase){
    switch (grcase) {
        case 'nom':
            return `<mark class="tag" style="background-color: gray">nom</mark>`; 
            break;
        case 'gen':
            return `<mark class="tag" style="background-color: gray">gen</mark>`; 
            break;
        case 'dat':
            return `<mark class="tag" style="background-color: gray">dat</mark>`; 
            break;
        case 'akk':
            return `<mark class="tag" style="background-color: gray">akk</mark>`; 
            break;
        default:
            return ``;
            break;
    }
}

function phraseConstructor(d){
    return d.map((item) => {
        let phrase = item.text;
        item.cases.forEach((kasus,index,array) => {
            phrase = phrase.replace(
                `$${String(index+1).padStart(2, '0')}`,
                `<input type="text" id="$${String(index+1).padStart(2, '0')}" data-answer="${kasus.answer}" class="case-input">
                ${genusTag(kasus.genus)} ${caseTag(kasus.case)}
                `
            )
        })
        item.html = phrase;
        return item;
    })
}

function setup(d){
    //console.log(d);
    __state.container.innerHTML = '';
    __state.container.innerHTML += `
        <blockquote>
            ${d[__state.current].html}
        </blockquote>
    `;
    const list = document.getElementById('status');
    list.innerHTML = '';
    d[__state.current].cases.forEach((item, index, array) => {
        list.innerHTML += `<li id="$$${String(index+1).padStart(2, '0')}">◯</li>`;
    })
    document.getElementById('count').textContent = `${__state.current+1}/${d.length}`;
    return d;
}

function events(d){
    eventCaseInput()
    eventInterfaceButtons(d)
}

function eventCaseInput(){
    Array.from(document.getElementsByClassName('case-input')).forEach((n) => {
        n.addEventListener('keydown', (event) => {
            var keycode = event.keyCode || event.which;
            if(keycode == '13'){
                //console.log(event.target);
                if(event.target.dataset.answer == event.target.value.trim().toLowerCase()){
                    //console.log('correct');
                    if(!event.target.classList.contains('correct')){
                        event.target.classList.toggle('correct');
                        document.getElementById(`$${event.target.id.split('#')[0]}`).textContent = '✅';
                    }

                    if(event.target.classList.contains('wrong')){
                        event.target.classList.toggle('wrong');
                    }
                } else {
                    //console.log('false');
                    if(!event.target.classList.contains('wrong')){
                        event.target.classList.toggle('wrong');
                        document.getElementById(`$${event.target.id.split('#')[0]}`).textContent = '❌';
                    }
                    
                    if(event.target.classList.contains('correct')){
                        event.target.classList.toggle('correct');
                    }
                }
                event.target.blur();
            }
        })
        }
    )
}

function eventInterfaceButtons(d){
    Array.from(document.querySelectorAll('#navsec button')).forEach((n) => {
        n.addEventListener('click', (e) => {
            switch (e.target.id) {
                case 'b':
                    if(__state.current != 0){
                        __state.current = __state.current - 1;
                        setup(d)
                        eventCaseInput()
                    }
                    break;
                case 'f':
                    if(__state.current != d.length-1){
                        __state.current  = __state.current + 1;
                        setup(d)
                        eventCaseInput()
                    }
                    break
                default:
                    break;
            }
        })
    })
}