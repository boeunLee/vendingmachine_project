class VendingMachineEvents {
    constructor() {
        // section 1
        const vMachine = document.querySelector('.section1');
        this.balance = vMachine.querySelector('.bg-box p'); //잔액
        this.itemList = vMachine.querySelector('.cola-list'); //콜라메뉴
        this.inputCostEl = vMachine.querySelector('#input-money'); //입금할 금액
        this.btnPut = vMachine.querySelector('#input-money+.btn'); //입금버튼
        this.btnReturn = vMachine.querySelector('.bg-box+.btn'); //거스름돈반환 버튼
        this.btnGet = vMachine.querySelector('.btn-get'); //획득버튼
        this.stagedList = vMachine.querySelector('.get-list'); //고른 콜라 목록 (장바구니))

        // section 2
        const myinfo = document.querySelector('.section2');
        this.myMoney = myinfo.querySelector('.bg-box strong'); //소지금

        // section 3
        const getInfo = document.querySelector('.section3');
        this.getList = getInfo.querySelector('.get-list'); //고른 콜라 목록
        this.txtTotal = getInfo.querySelector('.total-price'); //총금액
    }

    //장바구니 콜라 생성 함수
    stagedItemGenerator(target) {
        const stagedItem = document.createElement('li');

        // dataset을 이용해야 data-item , img 등등 이용가능
        // 쿼리셀렉터를 또 쓰기보다는 dataset이 효율적일 수 있음
        // 쿼리셀렉터는 탐색하는거니까 성능면에서 좋지 않음
        stagedItem.dataset.item = target.dataset.item;
        stagedItem.dataset.price = target.dataset.price;
        stagedItem.innerHTML = `
        <img src="./img/${target.dataset.img}" alt="">
            ${target.dataset.item}
        <strong>1
            <span class="a11y-hidden">개</span>
        </strong>
        `;
        this.stagedList.append(stagedItem);
    }


    bindEvent() {
        /**
         * 1. 입금 버튼 기능
         * 입금 버튼을 누르면 
         * 1) 소지금 === 소지금 - 입금액
         * 2) 잔액 === 기존 잔액 + 입금액
         * 3) 입금액이 소지금보다 많으면 경고창 출력
         * 4) 입금액이 정상적으로 입금되면 입금창은 초기화 되야한다.
         */
        this.btnPut.addEventListener('click', () => {
            // 입력값
            const inputCost = parseInt(this.inputCostEl.value);
            // 소지금 
            const myMoneyVal = parseInt(this.myMoney.textContent.replaceAll(',', ''));

            // 잔액
            const balanceVal = parseInt(this.balance.textContent.replaceAll(',', ''));

            if (inputCost) {
                // 입금액이 소지금 보다 적거나 같다면
                if (inputCost <= myMoneyVal && inputCost > 0) {
                    // Intl.NumberFormat(나라).format(숫자): 숫자를 통화형식으로 포멧해준다
                    this.myMoney.textContent = new Intl.NumberFormat().format(myMoneyVal - inputCost) + '원';

                    this.balance.textContent = new Intl.NumberFormat().format((balanceVal ? balanceVal : 0) + inputCost) + '원';

                    // 입금액이 소지금보다 많다!
                } else {
                    alert('소지금이 부족합니다.');
                }
                // 입금액 초기화 
                this.inputCostEl.value = "";
            }
        });


        /**
         * 2. 거스름돈 반환 버튼
         * 1) 반환버튼을 누르면 소지금 === 잔액 + 소지금
         * 2) 반환버튼을 누르면 잔액창이 초기화됩니다.
         */
        this.btnReturn.addEventListener('click', () => {
            // 잔액
            const balanceVal = parseInt(this.balance.textContent.replaceAll(',', ''));

            // 소지금 
            const myMoneyVal = parseInt(this.myMoney.textContent.replaceAll(',', ''));

            if (balanceVal) {
                this.myMoney.textContent = new Intl.NumberFormat().format(balanceVal + myMoneyVal) + '원';
                this.balance.textContent = null;
            }
        });


        /**
         * 3. 자판기 장바구니 채우기
         * 1) 아이템을 누르면 잔액 === 잔액 - 아이템 가격
         * 2) 아이템 가격이 잔액보다 크다면 경고메세지를 줍니다.
         * 3) 아이템이 장바구니에 들어갑니다.
         * 4) 아이템의 count가 -1이 됩니다. 아이템의 카운트가 0이되면 품절 표시를 합니다.
         */
        // btnsCola(콜라메뉴(아이템)을 누르는)가 여기에 적혀야 하는 이유? 
        // colaGenerator에서 콜라가 생성된 이후에 담을 수 있으니까, 생성자에 적으면 안됨
        this.btnsCola = document.querySelectorAll('.section1 .btn-cola');

        this.btnsCola.forEach((item) => {
            item.addEventListener('click', (event) => {
                const balanceVal = parseInt(this.balance.textContent.replaceAll(',', ''));
                // targetEl = 자판기 콜라들 중 내가 고른 콜라
                const targetEl = event.currentTarget;
                const targetElPrice = parseInt(targetEl.dataset.price);
                const stagedListitem = this.stagedList.querySelectorAll('li');
                let isStaged = false; // 이미 장바구니에 있는가?

                if (balanceVal >= targetElPrice) {
                    this.balance.textContent = new Intl.NumberFormat().format(balanceVal - targetElPrice) + '원';

                    // 장바구니에 있는 콜라 목록을 순회하며 검사
                    for (const item of stagedListitem) {
                        // 클릭한 콜라의 이름과 장바구니에 있던 콜라의 이름이 같은지 비교!
                        if (targetEl.dataset.item === item.dataset.item) {

                            // 이미 장바구니에 콜라가 있다면 카운트 +1
                            item.querySelector('strong').firstChild.textContent = parseInt(item.querySelector('strong').firstChild.textContent) + 1;

                            // 장바구니에 담겨있으니 갱신
                            isStaged = true;
                            break;
                        }
                    }

                    // 처음 선택했을 경우에만 장바구니에 콜라를 생성합니다.
                    if (!isStaged) {
                        //장바구니 콜라 생성
                        this.stagedItemGenerator(event.currentTarget);
                    }

                    // 장바구니에 들어갔으니, 자판기의 콜라 개수를 차감해야됨
                    targetEl.dataset.count--;

                    // 자판기의 콜라가 모두 팔렸을 경우 품절
                    if (!parseInt(targetEl.dataset.count)) {
                        // insertAdjacentHTML = 더 정밀한곳으로 배치
                        targetEl.insertAdjacentHTML('beforeEnd', `
                            <strong class= "soldout">
                                <span>품절</span>
                            </strong>
                            `
                        );

                        // 이게뭐더라
                        targetEl.disabled = "disabled";
                    }
                } else {
                    alert('입금한 금액이 부족합니다.');
                }
            })
        });


        /**
         * 4. 획득 버튼 기능
         * 1) 장바구니에 있는 음료수 목록이 획득한 음료 목록으로 이동합니다.
         * 2) 획득한 음료의 모든 금액을 합하여 총 금액을 업데이트합니다.
         */

        this.btnGet.addEventListener('click', () => {
            // const itemStagedList = this.stagedList.children;
            // const itemGetList = this.getList.children;
            const itemStagedList = this.stagedList.querySelectorAll('li');
            const itemGetList = this.getList.querySelectorAll('li');
            let totalPrice = 0;

            for (const itemStaged of itemStagedList) {
                let isGet = false; // 이미 획득했는가?, 이미 획득한 콜라인지 여부를 알 수 있는 변수
                for (const itemGet of itemGetList) {
                    // 콜라의 개수를 뽑아옴
                    console.log(itemStaged.querySelector('strong'));
                    // 장바구니의 콜라가 이미 획득한 목록에 있다면
                    if (itemStaged.dataset.item === itemGet.dataset.item) {
                        // 이미 장바구니에 콜라가 있다면 카운트 +1
                        itemGet.querySelector('strong').firstChild.textContent = parseInt(itemGet.querySelector('strong').firstChild.textContent) + parseInt(itemStaged.querySelector('strong').firstChild.textContent);

                        // 이미 획득한 콜라
                        isGet = true;
                        break;
                    }
                }

                // 획득한 목록에 없을 경우
                if (!isGet) {
                    // 내가 고른 콜라를 획득한 목록에 추가
                    this.getList.append(itemStaged);
                }
            }

            // 장바구니 목록 초기화
            this.stagedList.innerHTML = null;


            // 획득한 음료 리스트를 순회하면서 총금액을 계산합니다.
            this.getList.querySelectorAll('li').forEach((itemGet) => {
                totalPrice += parseInt(itemGet.dataset.price) * parseInt(itemGet.querySelector('strong').firstChild.textContent);
            });
            this.txtTotal.textContent = `총금액 : ${new Intl.NumberFormat().format(totalPrice)} 원`;
        });

    }
}

export default VendingMachineEvents;