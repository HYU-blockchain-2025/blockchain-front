// liquidity.js
document.addEventListener("DOMContentLoaded", () => {
  const tokenASelect = document.getElementById("tokenA");
  const tokenBSelect = document.getElementById("tokenB");
  const lpTokenList = document.getElementById("lp-token-list");

  // 1. tokens.json에서 토큰 목록 불러오기
  fetch("./data/tokens.json")
    .then((res) => res.json())
    .then((tokens) => {
      // Token A, Token B 셀렉트에 옵션 추가
      tokens.forEach((token) => {
        const optionA = document.createElement("option");
        optionA.value = token.symbol;
        optionA.textContent = token.symbol;
        tokenASelect.appendChild(optionA);

        const optionB = document.createElement("option");
        optionB.value = token.symbol;
        optionB.textContent = token.symbol;
        tokenBSelect.appendChild(optionB);
      });
    })
    .catch((err) => console.error(err));

  // 2. 유동성 토큰 목록 (예시)
  // 실제로는 지갑에서 조회된 LP 목록이어야 하나, 여기서는 하드코딩 예시
  const userLPTokens = [
    { pair: "BNB-CAKE", balance: 10 },
    { pair: "BNB-TT", balance: 5 },
  ];

  // 표시
  userLPTokens.forEach((lp) => {
    const li = document.createElement("li");
    li.textContent = `${lp.pair} LP: ${lp.balance} tokens`;
    lpTokenList.appendChild(li);
  });

  // 3. "Add Liquidity" 버튼 동작
  const btnAdd = document.getElementById("btn-add-liquidity");
  btnAdd.addEventListener("click", () => {
    const tokenAValue = tokenASelect.value;
    const tokenBValue = tokenBSelect.value;
    const amountA = document.getElementById("amountA").value;
    const amountB = document.getElementById("amountB").value;

    if (!tokenAValue || !tokenBValue || !amountA || !amountB) {
      alert("모든 필드를 입력해주세요!");
      return;
    }
    if (tokenAValue === tokenBValue) {
      alert("같은 토큰으로는 유동성을 추가할 수 없습니다.");
      return;
    }

    // 실제 유동성 추가 로직(스마트 컨트랙트 호출 등)은 생략
    alert(
      `Add Liquidity\nToken A: ${tokenAValue}, Amount: ${amountA}\nToken B: ${tokenBValue}, Amount: ${amountB}`
    );
  });

  // 4. "Remove Liquidity" 버튼 동작
  const btnRemove = document.getElementById("btn-remove-liquidity");
  btnRemove.addEventListener("click", () => {
    const lpSelect = document.getElementById("lpTokenSelect").value;
    const lpAmount = document.getElementById("lpAmount").value;

    if (!lpSelect || !lpAmount) {
      alert("LP 토큰 종류와 수량을 입력하세요.");
      return;
    }
    // 실제 유동성 제거 로직(스마트 컨트랙트 호출 등)은 생략
    alert(`Remove Liquidity\nLP Token: ${lpSelect}, Amount: ${lpAmount}`);
  });
});
