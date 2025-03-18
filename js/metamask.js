// nav.js

let currentAccount = null;
let currentBalance = null;

document.addEventListener("DOMContentLoaded", async () => {
  // Connect Wallet 버튼 이벤트 등록 (토글 기능)
  const connectBtn = document.querySelector(".btn-connect");
  if (connectBtn) {
    connectBtn.addEventListener("click", async () => {
      if (currentAccount) {
        // 이미 연결된 상태: 연결 해제 여부 확인
        const disconnectConfirmed = confirm("지갑 연결을 해제하시겠습니까?");
        if (disconnectConfirmed) {
          disconnectWallet();
        }
      } else {
        // 연결되지 않은 경우 연결 시도
        connectWallet();
      }
    });
  }

  // 새로고침 버튼 이벤트 등록 (단발성 잔액 업데이트)
  const refreshBtn = document.querySelector("#btn-refresh");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", async () => {
      if (currentAccount) {
        await updateAccountInfo(currentAccount);
        console.log("잔액 업데이트 완료");
      } else {
        console.log("지갑이 연결되지 않았습니다.");
      }
    });
    // 초기에는 숨김 처리
    refreshBtn.style.display = "none";
  }

  // MetaMask가 설치되어 있다면 계정/네트워크 변경 이벤트 리스너 추가
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
  }

  // 페이지 로드 시 자동 재연결 시도 (이미 연결된 계정이 있으면)
  await autoReconnect();
});

// MetaMask 연결 요청 함수
async function connectWallet() {
  if (window.ethereum) {
    try {
      // 연결 시도 전에 walletDisconnected 플래그 제거
      localStorage.removeItem("walletDisconnected");
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length > 0) {
        currentAccount = accounts[0];
        await updateAccountInfo(currentAccount);
        updateConnectButton(true);
      }
    } catch (error) {
      console.error("MetaMask 연결 실패:", error);
    }
  } else {
    alert("MetaMask가 설치되어 있지 않습니다. 설치 후 다시 시도해주세요.");
  }
}

// 자동 재연결 함수: 이미 연결된 계정이 있으면 자동으로 정보를 불러옴
async function autoReconnect() {
  if (window.ethereum) {
    // 사용자가 연결 해제를 선택한 경우 자동 재연결하지 않음
    if (localStorage.getItem("walletDisconnected") === "true") {
      return;
    }
    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        currentAccount = accounts[0];
        await updateAccountInfo(currentAccount);
        updateConnectButton(true);
      }
    } catch (error) {
      console.error("자동 재연결 실패:", error);
    }
  }
}

// 계정의 잔액을 가져와 UI 업데이트
async function updateAccountInfo(account) {
  try {
    const balanceHex = await window.ethereum.request({
      method: "eth_getBalance",
      params: [account, "latest"],
    });
    // 16진수를 10진수로 변환 후 Ether 단위로 변환 (1 ETH = 1e18 Wei)
    const balance = parseFloat(parseInt(balanceHex, 16) / 1e18).toFixed(4);
    currentBalance = balance;
    displayAccountInfo(account, balance);
  } catch (error) {
    console.error("잔액 가져오기 실패:", error);
  }
}

// 상단 네비게이션 바의 .balance 요소에 계정 정보와 잔액(초록색 점 포함) 표시
function displayAccountInfo(account, balance) {
  const balanceDiv = document.querySelector(".balance");
  const greenDot = `<span style="display:inline-block; width:10px; height:10px; background:green; border-radius:50%; margin-right:5px;"></span>`;
  balanceDiv.innerHTML = `${greenDot}${account} (${balance} ETH)`;
}

// Connect Wallet 버튼 UI 업데이트 및 새로고침 버튼 표시 여부 업데이트
function updateConnectButton(isConnected) {
  const connectBtn = document.querySelector(".btn-connect");
  if (isConnected) {
    connectBtn.textContent = "Wallet Connected";
  } else {
    connectBtn.textContent = "Connect Wallet";
  }
  // 새로고침 버튼만 연결 상태일 때 보이도록 처리
  const refreshBtn = document.querySelector("#btn-refresh");
  if (refreshBtn) {
    refreshBtn.style.display = isConnected ? "inline-block" : "none";
  }
}

// 연결 해제 함수 (내부 상태 및 UI 초기화, disconnect 플래그 저장)
function disconnectWallet() {
  // 연결 해제 플래그 저장 (이후 자동 재연결 방지)
  localStorage.setItem("walletDisconnected", "true");
  currentAccount = null;
  currentBalance = null;
  updateConnectButton(false);
  // UI 업데이트: 잔액 정보 삭제
  const balanceDiv = document.querySelector(".balance");
  if (balanceDiv) {
    balanceDiv.innerHTML = "";
  }
  console.log("지갑 연결이 해제되었습니다.");
}

// 계정 변경 이벤트 처리
function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    disconnectWallet();
  } else {
    currentAccount = accounts[0];
    updateAccountInfo(currentAccount);
  }
}

// 네트워크 변경 이벤트 처리
function handleChainChanged(_chainId) {
  if (currentAccount) {
    updateAccountInfo(currentAccount);
  }
}
