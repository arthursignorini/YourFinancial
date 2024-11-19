$(function() {

    start();

    function start() {
        $("#screen2").hide();
    }

    function changeScreen() {
        $("#screen1").slideToggle("slow");
        $("#screen2").fadeToggle("slow");
    }

    $("#inputForm").on("submit", function(event) {
        event.preventDefault(); 

        const name = $("#name").val();
        const initialInvestment = parseFloat($("#initialInvestment").val());
        const monthlyInvestment = parseFloat($("#monthlyInvestment").val());
        const annualInterestRate = parseFloat($("#annualInterestRate").val());
        const contributionTime = parseInt($("#contributionTime").val());

        if (!name || initialInvestment <= 0 || monthlyInvestment <= 0 || annualInterestRate <= 0 || contributionTime <= 0) {
            return 0;
        }

        
        const years = Math.floor(contributionTime / 12);
        const months = contributionTime % 12;
        const contributionTimeFormatted = years != 0
            ? (years + " anos" + (months != 0 ? " e " + months + " meses" : ""))
            : (months + " meses");

        
        const monthlyInterestRate = Math.pow(1 + annualInterestRate / 100, 1 / 12) - 1;

        
        const futureValueInitial = initialInvestment * Math.pow(1 + monthlyInterestRate, contributionTime);

        
        const futureValueMonthly = monthlyInvestment * ((Math.pow(1 + monthlyInterestRate, contributionTime) - 1) / monthlyInterestRate) * (1 + monthlyInterestRate);

        
        const totalFutureValue = futureValueInitial + futureValueMonthly;

        
        const totalInvested = initialInvestment + (monthlyInvestment * contributionTime);

        
        const profit = totalFutureValue - totalInvested;

        
        let result = totalFutureValue.toFixed(2).replace(".", ",");
        let totalInvestedFormatted = totalInvested.toFixed(2).replace(".", ",");
        let profitFormatted = profit.toFixed(2).replace(".", ",");

        
        let initialInvestmentFormatted = initialInvestment.toFixed(2).replace(".", ",");
        let monthlyInvestmentFormatted = monthlyInvestment.toFixed(2).replace(".", ",");

        
        const output = `Olá <strong>${name}</strong>, investindo <strong>R$ ${initialInvestmentFormatted}</strong> inicialmente e <strong>R$ ${monthlyInvestmentFormatted}</strong> todo mês,
        você terá <strong>R$ ${result}</strong> em ${contributionTimeFormatted}.<br>
        O total investido será <strong>R$ ${totalInvestedFormatted}</strong> e o lucro obtido será <strong>R$ ${profitFormatted}</strong>.`;

        $("#outputText").html(output);

        
        const investmentData = {
            name: name,
            initialInvestment: initialInvestmentFormatted,
            monthlyInvestment: monthlyInvestmentFormatted,
            totalFutureValue: result,
            totalInvested: totalInvestedFormatted,
            profit: profitFormatted,
            contributionTime: contributionTimeFormatted
        };
        localStorage.setItem('investmentData', JSON.stringify(investmentData));

        changeScreen();
    });

    $("#simulateAgain").on("click", changeScreen);

    
    function loadFromLocalStorage() {
        const savedData = localStorage.getItem('investmentData');
        if (savedData) {
            const data = JSON.parse(savedData);
            $("#name").val(data.name);
            $("#initialInvestment").val(data.initialInvestment.replace(",", "."));
            $("#monthlyInvestment").val(data.monthlyInvestment.replace(",", "."));
            
        }
    }

    loadFromLocalStorage();
});
