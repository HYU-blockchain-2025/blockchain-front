document.addEventListener("DOMContentLoaded", async () => {
    // Web3 인스턴스 생성 (메타마스크가 설치된 경우)
    if (typeof window.ethereum !== "undefined") {
        window.web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" }); // 메타마스크 계정 요청
        } catch (error) {
            console.error("메타마스크 계정 요청 실패:", error);
            alert("메타마스크 계정을 연결해주세요.");
            return;
        }
    } else {
        alert("메타마스크가 설치되어 있지 않습니다. 메타마스크를 먼저 설치해주세요.");
        return;
    }

    const btnTransfer = document.getElementById("btn-transfer");

    btnTransfer.addEventListener("click", async () => {
        const recipientAddress = document.getElementById("recipient-address").value.trim();
        const amount = document.getElementById("amount").value.trim();

        if (!recipientAddress || !amount) {
            alert("수신 주소와 전송 금액을 입력해주세요.");
            return;
        }

        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length === 0) {
            alert("메타마스크에 연결된 계정이 없습니다.");
            return;
        }

        const senderAddress = accounts[0]; // 메타마스크의 첫 번째 계정
        const weiAmount = web3.utils.toWei(amount, "ether"); // ETH → WEI 변환

        try {
            const txHash = await window.ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                    from: senderAddress,
                    to: recipientAddress,
                    value: web3.utils.toHex(weiAmount), // HEX 값으로 변환
                    gas: web3.utils.toHex(21000), // 기본 가스 리밋 설정 (일반 전송 시)
                }],
            });

            alert(`트랜잭션 전송 완료!\n트랜잭션 해시: ${txHash}`);
        } catch (error) {
            alert("트랜잭션 전송에 실패했습니다.");
        }
    });
});
