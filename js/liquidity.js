// liquidity.js

document.addEventListener("DOMContentLoaded", () => {
  // 탭 관련 요소
  const tabs = document.querySelectorAll(".swap-tab");
  const swapView = document.getElementById("swapView");
  const liquidityView = document.getElementById("liquidityView");

  // 유동성 추가/제거 버튼
  const btnAdd = document.getElementById("btnAddLiquidity");
  const btnRemove = document.getElementById("btnRemoveLiquidity");

  btnAdd.addEventListener("click", () => {
    const amount = document.getElementById("add-amount").value;
    if (!amount || Number(amount) <= 0) {
      alert("올바른 토큰 개수를 입력해주세요.");
      return;
    }
    // 실제 유동성 추가 로직 (예: 스마트 컨트랙트 호출 등)
    alert(`유동성 추가: ${amount} 토큰`);
  });

  btnRemove.addEventListener("click", () => {
    const amount = document.getElementById("remove-amount").value;
    if (!amount || Number(amount) <= 0) {
      alert("올바른 토큰 개수를 입력해주세요.");
      return;
    }
    // 실제 유동성 제거 로직
    alert(`유동성 제거: ${amount} 토큰`);
  });
});
