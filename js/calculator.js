document.addEventListener('DOMContentLoaded', function() {
    // 获取所有输入元素
    const inputs = {
        productPrice: document.getElementById('productPrice'),
        productCost: document.getElementById('productCost'),
        shippingCost: document.getElementById('shippingCost'),
        totalProductCard: document.getElementById('totalProductCard'),
        totalVideo: document.getElementById('totalVideo'),
        productCardNatural: document.getElementById('productCardNatural'),
        productCardAd: document.getElementById('productCardAd'),
        videoNatural: document.getElementById('videoNatural'),
        videoAd: document.getElementById('videoAd'),
        adCost: document.getElementById('adCost'),
        influencerCommission: document.getElementById('influencerCommission'),
        monthlyVolume: document.getElementById('monthlyVolume'),
        productCardAutoCalc: document.getElementById('productCardAutoCalc'),
        videoAutoCalc: document.getElementById('videoAutoCalc')
    };

    // 获取结果显示元素
    const results = {
        totalOrderPercentage: document.getElementById('totalOrderPercentage'),
        productCardPercentage: document.getElementById('productCardPercentage'),
        videoPercentage: document.getElementById('videoPercentage'),
        profitPerItem: document.getElementById('profitPerItem'),
        profitMargin: document.getElementById('profitMargin'),
        monthlyProfit: document.getElementById('monthlyProfit'),
        yearlyProfit: document.getElementById('yearlyProfit'),
        costBreakdown: document.getElementById('costBreakdown'),
        platformFeeAmount: document.getElementById('platformFeeAmount'),
        paymentFeeAmount: document.getElementById('paymentFeeAmount'),
        avgInfluencerCommission: document.getElementById('avgInfluencerCommission'),
        avgAdCost: document.getElementById('avgAdCost'),
        shippingCostAmount: document.getElementById('shippingCostAmount')
    };

    // 常量
    const PLATFORM_FEE = 0.06; // 6%

    // 更新总订单分布占比
    function updateTotalOrderPercentage() {
        const total = Number(inputs.totalProductCard.value || 0) + Number(inputs.totalVideo.value || 0);
        results.totalOrderPercentage.textContent = total.toFixed(1);
        results.totalOrderPercentage.style.color = total === 100 ? '#4caf50' : '#fe2c55';
    }

    // 更新商品卡流量分布占比
    function updateProductCardPercentage() {
        const total = Number(inputs.productCardNatural.value || 0) + Number(inputs.productCardAd.value || 0);
        results.productCardPercentage.textContent = total.toFixed(1);
        results.productCardPercentage.style.color = total === 100 ? '#4caf50' : '#fe2c55';
    }

    // 更新短视频流量分布占比
    function updateVideoPercentage() {
        const total = Number(inputs.videoNatural.value || 0) + Number(inputs.videoAd.value || 0);
        results.videoPercentage.textContent = total.toFixed(1);
        results.videoPercentage.style.color = total === 100 ? '#4caf50' : '#fe2c55';
    }

    // 添加总订单分布输入监听
    [inputs.totalProductCard, inputs.totalVideo].forEach(input => {
        input.addEventListener('input', updateTotalOrderPercentage);
    });

    // 添加商品卡流量分布输入监听
    [inputs.productCardNatural, inputs.productCardAd].forEach(input => {
        input.addEventListener('input', updateProductCardPercentage);
    });

    // 添加短视频流量分布输入监听
    [inputs.videoNatural, inputs.videoAd].forEach(input => {
        input.addEventListener('input', updateVideoPercentage);
    });

    // 自动计算广告占比
    function setupAutoCalc(naturalInput, adInput, autoCalcCheckbox) {
        const DEFAULT_NATURAL_RATE = 30; // 默认自然流量占比30%

        function updateAdRate() {
            if (autoCalcCheckbox.checked) {
                const naturalRate = Number(naturalInput.value) || 0;
                adInput.value = (100 - naturalRate).toFixed(1);
                adInput.disabled = true;
                // 更新对应的总占比
                if (naturalInput.id === 'productCardNatural') {
                    updateProductCardPercentage();
                } else {
                    updateVideoPercentage();
                }
            } else {
                adInput.disabled = false;
            }
        }

        // 设置初始状态
        autoCalcCheckbox.addEventListener('change', function() {
            if (this.checked && !naturalInput.value) {
                naturalInput.value = DEFAULT_NATURAL_RATE;
            }
            updateAdRate();
        });

        naturalInput.addEventListener('input', function() {
            if (autoCalcCheckbox.checked) {
                updateAdRate();
            }
        });
    }

    // 设置商品卡和短视频的自动计算
    setupAutoCalc(inputs.productCardNatural, inputs.productCardAd, inputs.productCardAutoCalc);
    setupAutoCalc(inputs.videoNatural, inputs.videoAd, inputs.videoAutoCalc);

    // 验证输入
    function validateInputs() {
        // 检查必填项（排除被禁用的输入框）
        for (let key in inputs) {
            const input = inputs[key];
            if (input.tagName === 'INPUT' && !input.disabled && input.type !== 'checkbox' && input.value === '') {
                alert('请填写所有必填项');
                input.focus();
                return false;
            }
        }

        // 检查总订单分布是否为100%
        const totalOrder = Number(inputs.totalProductCard.value || 0) + Number(inputs.totalVideo.value || 0);
        if (Math.abs(totalOrder - 100) > 0.1) {
            alert('商品卡订单与短视频订单的总占比必须等于100%');
            return false;
        }

        // 检查商品卡流量分布是否为100%
        const totalProductCard = Number(inputs.productCardNatural.value || 0) + Number(inputs.productCardAd.value || 0);
        if (Math.abs(totalProductCard - 100) > 0.1) {
            alert('商品卡订单的自然流量与广告流量占比之和必须等于100%');
            return false;
        }

        // 检查短视频流量分布是否为100%
        const totalVideo = Number(inputs.videoNatural.value || 0) + Number(inputs.videoAd.value || 0);
        if (Math.abs(totalVideo - 100) > 0.1) {
            alert('短视频订单的自然流量与广告流量占比之和必须等于100%');
            return false;
        }

        return true;
    }

    // 添加计算过程展开/收起功能
    const processToggle = document.querySelector('.process-toggle');
    const processDetails = document.querySelector('.process-details');

    processToggle.addEventListener('click', function() {
        const isExpanded = processDetails.style.display !== 'none';
        processDetails.style.display = isExpanded ? 'none' : 'block';
        this.textContent = isExpanded ? '查看计算过程 ▼' : '收起计算过程 ▲';
    });

    // 计算利润
    function calculateProfit() {
        if (!validateInputs()) return;

        // 获取基础输入值
        const price = Number(inputs.productPrice.value);
        const cost = Number(inputs.productCost.value);
        const shipping = Number(inputs.shippingCost.value);
        const adCostPerOrder = Number(inputs.adCost.value);
        const influencerRate = Number(inputs.influencerCommission.value) / 100;
        const monthlyVol = Number(inputs.monthlyVolume.value);

        // 获取订单分布
        const productCardRate = Number(inputs.totalProductCard.value) / 100;
        const videoRate = Number(inputs.totalVideo.value) / 100;

        // 获取流量来源分布
        const productCardNaturalRate = Number(inputs.productCardNatural.value) / 100;
        const productCardAdRate = Number(inputs.productCardAd.value) / 100;
        const videoNaturalRate = Number(inputs.videoNatural.value) / 100;
        const videoAdRate = Number(inputs.videoAd.value) / 100;

        // 计算实际的广告订单比例（考虑总订单分布）
        const totalAdRate = (productCardRate * productCardAdRate) + (videoRate * videoAdRate);

        // 计算平台费用
        const platformFeeAmount = price * PLATFORM_FEE;

        // 计算平均达人佣金（针对所有短视频订单）
        const avgInfluencerAmount = price * influencerRate * videoRate;

        // 计算平均广告费用（只针对广告流量订单）
        const avgAdAmount = adCostPerOrder * totalAdRate;

        // 计算总成本（删除支付手续费）
        const totalCost = cost + shipping + platformFeeAmount + avgInfluencerAmount + avgAdAmount;

        // 计算利润
        const profitPerItem = price - totalCost;
        const profitMargin = (profitPerItem / price) * 100;
        const monthlyProfitAmount = profitPerItem * monthlyVol;
        const yearlyProfitAmount = monthlyProfitAmount * 12;

        // 更新结果显示
        results.profitPerItem.textContent = formatCurrency(profitPerItem);
        results.profitMargin.textContent = formatPercentage(profitMargin);
        results.monthlyProfit.textContent = formatCurrency(monthlyProfitAmount);
        results.yearlyProfit.textContent = formatCurrency(yearlyProfitAmount);

        // 更新成本明细（删除支付手续费显示）
        results.costBreakdown.textContent = formatCurrency(cost);
        results.platformFeeAmount.textContent = formatCurrency(platformFeeAmount);
        results.avgInfluencerCommission.textContent = formatCurrency(avgInfluencerAmount);
        results.avgAdCost.textContent = formatCurrency(avgAdAmount);
        results.shippingCostAmount.textContent = formatCurrency(shipping);

        // 根据利润率设置颜色
        const profitColor = profitMargin >= 15 ? '#4caf50' : profitMargin >= 0 ? '#ff9800' : '#fe2c55';
        results.profitPerItem.style.color = profitColor;
        results.profitMargin.style.color = profitColor;
        results.monthlyProfit.style.color = profitColor;
        results.yearlyProfit.style.color = profitColor;

        // 更新计算过程显示
        updateCalculationProcess({
            price,
            cost,
            shipping,
            adCostPerOrder,
            influencerRate,
            productCardRate,
            videoRate,
            productCardNaturalRate,
            productCardAdRate,
            videoNaturalRate,
            videoAdRate,
            totalAdRate,
            platformFeeAmount,
            avgInfluencerAmount,
            avgAdAmount,
            totalCost,
            profitPerItem,
            profitMargin
        });
    }

    // 更新计算过程显示
    function updateCalculationProcess(data) {
        // 1. 订单分布说明
        const orderDistribution = document.getElementById('orderDistribution');
        orderDistribution.innerHTML = `
            <p>商品卡订单占比: ${(data.productCardRate * 100).toFixed(1)}%</p>
            <ul>
                <li>自然流量: ${(data.productCardNaturalRate * 100).toFixed(1)}%</li>
                <li>广告流量: ${(data.productCardAdRate * 100).toFixed(1)}%</li>
            </ul>
            <p>短视频订单占比: ${(data.videoRate * 100).toFixed(1)}%</p>
            <ul>
                <li>自然流量: ${(data.videoNaturalRate * 100).toFixed(1)}%</li>
                <li>广告流量: ${(data.videoAdRate * 100).toFixed(1)}%</li>
            </ul>
            <p>总广告流量占比: ${(data.totalAdRate * 100).toFixed(1)}%</p>
        `;

        // 2. 费用计算说明
        const feeCalculation = document.getElementById('feeCalculation');
        feeCalculation.innerHTML = `
            <p>基础成本:</p>
            <ul>
                <li>商品成本: ${formatCurrency(data.cost)}</li>
                <li>运输成本: ${formatCurrency(data.shipping)}</li>
            </ul>
            <p>平台费用:</p>
            <ul>
                <li>平台服务费 (${(PLATFORM_FEE * 100)}%): ${formatCurrency(data.platformFeeAmount)}</li>
            </ul>
            <p>营销成本:</p>
            <ul>
                <li>达人佣金 (${(data.influencerRate * 100).toFixed(1)}% × 短视频订单): ${formatCurrency(data.avgInfluencerAmount)}</li>
                <li>平均广告费用 (${formatCurrency(data.adCostPerOrder)} × ${(data.totalAdRate * 100).toFixed(1)}%): ${formatCurrency(data.avgAdAmount)}</li>
            </ul>
            <p>总成本: ${formatCurrency(data.totalCost)}</p>
        `;

        // 3. 利润计算说明
        const profitCalculation = document.getElementById('profitCalculation');
        profitCalculation.innerHTML = `
            <p>售价: ${formatCurrency(data.price)}</p>
            <p>总成本: ${formatCurrency(data.totalCost)}</p>
            <p>单件利润: ${formatCurrency(data.profitPerItem)}</p>
            <p>利润率: ${formatPercentage(data.profitMargin)}</p>
        `;
    }

    // 格式化金额
    function formatCurrency(amount) {
        return '$ ' + amount.toFixed(2);
    }

    // 格式化百分比
    function formatPercentage(percentage) {
        return percentage.toFixed(2) + '%';
    }

    // 添加计算按钮事件监听
    document.getElementById('calculateBtn').addEventListener('click', calculateProfit);

    // 添加输入框回车键触发计算
    Object.values(inputs).forEach(input => {
        if (input.tagName === 'INPUT' && input.type !== 'checkbox') {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    calculateProfit();
                }
            });
        }
    });

    // 添加数字输入限制
    Object.values(inputs).forEach(input => {
        if (input.tagName === 'INPUT' && input.type !== 'checkbox') {
            input.addEventListener('input', function() {
                if (this.value < 0) this.value = 0;
                if (this.hasAttribute('max') && Number(this.value) > Number(this.getAttribute('max'))) {
                    this.value = this.getAttribute('max');
                }
            });
        }
    });
}); 