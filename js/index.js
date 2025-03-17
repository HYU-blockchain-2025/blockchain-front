// index.js

// 간단한 예시로, 실제 스왑 기능은 구현하지 않고 탭 전환 정도만 예시로 작성합니다.
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".swap-tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // 모든 탭에서 active 제거
      tabs.forEach((t) => t.classList.remove("active"));
      // 클릭된 탭에 active 추가
      tab.classList.add("active");

      // 실제로는 탭에 따라 다른 화면을 보여주거나 하는 로직을 추가할 수 있습니다.
    });
  });
});
