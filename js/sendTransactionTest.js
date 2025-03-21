document.addEventListener("DOMContentLoaded", async () => {
    if (typeof window.ethereum !== "undefined") {
        window.web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" }); 
        } catch (error) {
            console.error("메타마스크 계정 요청 실패:", error);
            alert("메타마스크 계정을 연결해주세요.");
            return;
        }
    } else {
        alert("메타마스크가 설치되어 있지 않습니다. 메타마스크를 먼저 설치해주세요.");
        return;
    }

    let tokenABI;
    try {
        const response = await fetch("./abi/ERC20ABI.json");
        tokenABI = await response.json();
    } catch (error) {
        console.error("ERC-20 ABI 파일 로드 실패:", error);
        alert("ERC-20 ABI를 불러올 수 없습니다.");
        return;
    }

    const btnTransfer = document.getElementById("btn-transfer");
    if (!btnTransfer) {
        console.error("Button with ID 'btn-transfer' not found!");
        return;
    }

    btnTransfer.addEventListener("click", async () => {
        const recipientAddress = document.getElementById("recipient-address").value.trim();
        const amount = document.getElementById("amount").value.trim();
        const tokenContractAddress = "0x2f27a85591Ecf83BC299A4A974e8d062126B7eF1"; // ⚠️ ERC-20 컨트랙트 주소 입력

        if (!recipientAddress || !amount) {
            alert("수신 주소와 전송 금액을 입력해주세요.");
            return;
        }

        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length === 0) {
            alert("메타마스크에 연결된 계정이 없습니다.");
            return;
        }

        const senderAddress = accounts[0];
        const tokenContract = new web3.eth.Contract(tokenABI, tokenContractAddress);

        let decimals = 18; // 기본값 설정 (컨트랙트에서 조회 실패 시 대비)
        try {
            decimals = await tokenContract.methods.decimals().call();
            decimals = BigInt(decimals); // 혼용 오류 방지를 위해 Number 변환
        } catch (error) {
            console.warn("decimals() 함수가 지원되지 않음. 기본값(18) 사용.");
        }
        
        // Web3.js API를 사용하여 올바른 토큰 단위 변환 (BigInt 연산)
        // 모든 연산을 BigInt로 변환
        const exponent = BigInt(decimals);
        const multiplier = BigInt(10n ** exponent);
        const tokenAmount = (BigInt(amount) * multiplier).toString();

        console.log(`전송할 토큰 수량 (WEI 단위): ${tokenAmount.toString()}`);

        try {
            // 예상 가스 계산
            const gasEstimate = await tokenContract.methods.transfer(recipientAddress, tokenAmount).estimateGas({
                from: senderAddress
            });

            console.log(`예상 가스: ${gasEstimate}`);

            // 트랜잭션 실행
            const tx = await tokenContract.methods.transfer(recipientAddress, tokenAmount).send({
                from: senderAddress
            });

            alert(`토큰 전송 성공!\n트랜잭션 해시: ${tx.transactionHash}`);
            console.log("트랜잭션 해시:", tx.transactionHash);
        } catch (error) {
            console.error("토큰 전송 실패:", error);
            alert("토큰 전송에 실패했습니다.");
        }
    });
});
