class ColaGenerator {
    constructor() {
        this.itemList = document.querySelector('.section1 .cola-list');
    }

    async setup() {
        const response = await this.loadData();

        this.colaFactory(response);
    }


    async loadData() {
        try {
            const response = await fetch('./items.json');

            if (response.ok) { // 서버의 응답 코드가 200 ~ 299 일 경우
                return response.json();
            } else {
                throw new Error(response.status);
            }
        } catch (error) {
            console.log(error);
        }
    }

    colaFactory(data) {
        // 가상 DOM을 형성하여 보다 효율적이게 관리한다.
        // 이벤트를 여기서 바로바로 발생시키게 했으면 await를 해줄 필요가 있을까? 
        const frag = document.createDocumentFragment();
        data.forEach((el) => {
            const item = document.createElement('li');
            // data- 라는 attribute 이용
            const itemTemplate = `
            <button class="btn-cola" type="button" data-item="${el.name}" data-count="${el.count}" data-price="${el.cost}" data-img="${el.img}">
                <img class="cola-img" src="./img/${el.img}" alt="">
                <span class="cola-name">${el.name}</span>
                <strong class="cola-price">${el.cost}원</strong>
            </button>
            `;

            item.innerHTML = itemTemplate;
            // 리플로우, 리페인트 과정 자체가 HMTL을 변환시키는건데 itemList에 계속해서 보내면 비효율적이다. 따라서 frag라는 가상 DOM을 만들어서 넣어주는게 더 효율적이다. 
            frag.append(item);
        })
        this.itemList.append(frag);
    }


}

export default ColaGenerator;