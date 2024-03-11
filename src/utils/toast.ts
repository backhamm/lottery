// 创建弹出框容器
const div = document.createElement('div');
div.id = 'toast';
document.body.appendChild(div);

export const toast = (message) => {
    const time = 3000;
    const wrapper = document.getElementById('toast');
    const html = `<div class="wrapper" style="animation-duration: ${time / 1000}s">
                    <div class="main">
                        <div class="message">${message}</div>
                    </div>
                </div>`;
    wrapper.insertAdjacentHTML('afterbegin', html);
    setTimeout(() => {
        wrapper.removeChild(wrapper.lastChild)
    }, time)
};