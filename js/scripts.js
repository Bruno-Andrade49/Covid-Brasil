const _elements = {
    loading: document.querySelector(".loading"),
    switch: document.querySelector(".switch__track"),
    stateSelectToggle: document.querySelector(".state-select-toggle"),
    selectOptions: document.querySelectorAll(".state-select-list__item"),
    selectList: document.querySelector(".state-select-list"),
    selectToggleIcon: document.querySelector(".state-select-toggle__icon"),
    selectSearchBox: document.querySelector(".state-select-list__search"),
    selectStateSelected: document.querySelector(".state-select-toggle__state-selected"),
    confirmed: document.querySelector(".info__total--confirmed"),
    deaths: document.querySelector(".info__total--deaths"),
    deathsDescription: document.querySelector(".data-box__description"),
    vaccinated1: document.querySelector(".info__total--vaccinated-1"),
    vaccinated2: document.querySelector(".info__total--vaccinated-2"),
}

const _data = {
    id: "brasil=true",
    vaccinatedInfo: undefined,
    vaccinated: undefined,
    confirmed: undefined,
    deaths: undefined,
}

const _grafico01 = {
    dias : [],
    variacao_absoluta_sobre_o_dia_anterior : [],
    media_semanal: []
}

const _charts = {};

_elements.switch.addEventListener("click", () => {
    const isDark = _elements.switch.classList.toggle("switch__track--dark");

    if(isDark === true) {
        document.documentElement.setAttribute("data-theme", "dark");
    } else {
        document.documentElement.setAttribute("data-theme", "light");
    }
});

_elements.stateSelectToggle.addEventListener("click", () => {

    _elements.selectToggleIcon.classList.toggle("state-select-toggle__icon--rotate");

    _elements.selectList.classList.toggle("state-select-list--show");


});

_elements.selectOptions.forEach(item => {

    item.addEventListener("click", () => {
        _elements.selectStateSelected.innerText = item.innerText;
        _data.id = item.getAttribute("data-id")
        _elements.stateSelectToggle.dispatchEvent(new Event("click"))

        loadData(_data.id);
    })

});

_elements.selectSearchBox.addEventListener("keyup", (e) => {

    const pesquisa = e.target.value.toLowerCase();

    for(const item of _elements.selectOptions) {
        const state = item.innerText.toLowerCase();

        if(state.includes(pesquisa)) {
            item.classList.remove("state-select-list__item--hide");
        } else {
            item.classList.add("state-select-list__item--hide");
        }
    }

});

const request = async (api, id) => {

    try {
        const url = api + id;
    
        const data = await fetch(url)
        const json = await data.json();
    
        return json;

    } catch (erro)  {
        console.log(erro)
    }


}

const loadData = async (id) => {

    _elements.loading.classList.remove("loading--hide");

    _data.confirmed = await request(_api.confirmed, id);

    _data.deaths = await request(_api.deaths, id);
    _data.vaccinated = await request(_api.vaccinated, id);
    _data.vaccinatedInfo = await request(_api.vaccinatedInfo, "");
    
    updateCards();
    
    _elements.loading.classList.add("loading--hide");
    
    updateCharts();
}

const createGrafico01 = () => {

    const ultimoDia = _data.confirmed.length-1
    for(i = 30; i > 0; i--) {
        const dias = _data.confirmed[ultimoDia]["data"]
        _grafico01.dias.push(dias)

        const variacao = _data.confirmed[ultimoDia]["variacao_absoluta_sobre_o_dia_anterior"]
        _grafico01.dias.push(variacao)

        const media = _data.confirmed[ultimoDia]["media_semanal"]
        _grafico01.dias.push(media)

        ultimoDia --;
    }
    console.log(_grafico01)

}


const updateCards = () => {
    const uf = _ufs[_data.id]

    _elements.confirmed.innerText = _data.confirmed[_data.confirmed.length-1]["total_de_casos"];
    _elements.deaths.innerText = _data.deaths[_data.deaths.length-1]["total_de_mortes"];
    _elements.vaccinated1.innerText = _data.vaccinatedInfo.extras[uf]["info"]["total-hoje-dose-1"];
    _elements.vaccinated2.innerText = _data.vaccinatedInfo.extras[uf]["info"]["total-hoje-dose-2"] + 
                                    _data.vaccinatedInfo.extras[uf]["info"]["total-hoje-dose-unica"];

    _elements.confirmed.innerText = Number(_elements.confirmed.innerText).toLocaleString();
    _elements.deaths.innerText = Number(_elements.deaths.innerText).toLocaleString();
    _elements.vaccinated1.innerText = Number(_elements.vaccinated1.innerText).toLocaleString();
    _elements.vaccinated2.innerText = Number(_elements.vaccinated2.innerText).toLocaleString();


}

const updateCharts = () => {

    const ctx = document.getElementsByClassName('line-chart');
    
        const linechart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril',
                 'Abril', 'Maio', "Junho", "Julho", "Agosto", "Setembro", 
                 "Outubro", "Novembro", "Dezembro"],
                datasets: [{
                    label: '',
                    data: [1,2,3,4,5,6,7,8,2,5,1,3,7,4,2,6,4,2,1,5,7 ],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
            
                }
            }
        });


}


loadData(_data.id);
createCharts();