// admin.js
let tokenData = [];

// 1. JSON 파일 로드
document.addEventListener("DOMContentLoaded", () => {
  loadTokens();

  // // Add Token 버튼 이벤트
  // document.getElementById("btn-add-token").addEventListener("click", () => {
  //   addToken();
  // });
});

// tokens.json 불러오기
function loadTokens() {
  fetch("./data/tokens.json")
    .then((res) => res.json())
    .then((data) => {
      tokenData = data;
      renderTokenTable();
    })
    .catch((err) => console.error(err));
}

// 토큰 목록 테이블 렌더링
function renderTokenTable() {
  const tbody = document.querySelector("#token-table tbody");
  tbody.innerHTML = "";

  tokenData.forEach((token, index) => {
    const tr = document.createElement("tr");

    const tdSymbol = document.createElement("td");
    tdSymbol.textContent = token.symbol;

    const tdName = document.createElement("td");
    tdName.textContent = token.name;

    const tdDecimals = document.createElement("td");
    tdDecimals.textContent = token.amounts;

    const tdAddress = document.createElement("td");
    tdAddress.textContent = token.address;

    tr.appendChild(tdSymbol);
    tr.appendChild(tdName);
    tr.appendChild(tdDecimals);
    tr.appendChild(tdAddress);

    tbody.appendChild(tr);
  });
}
