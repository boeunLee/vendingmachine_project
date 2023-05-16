import ColaGenerator from "./classes/colaGenerator.js";
import VendingMachineEvents from "./classes/vendingMachineEvents.js";

const colaGenerator = new ColaGenerator();
const vendingMachineEvents = new VendingMachineEvents();

(async function(){
    // 콜라가 만들어질때까지 기다려야되니까 await
    await colaGenerator.setup();
    vendingMachineEvents.bindEvent();
})()

// 생성자는 new로부터 호출이 먼저 됨
// 생성자 안에 btnsCola가 있으면, setup()이 뒤에 생겨나는데