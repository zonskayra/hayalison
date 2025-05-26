/**
 * Kişisel Bütçe Takip - Grafik İşlemleri
 * Chart.js kütüphanesi kullanarak çeşitli grafikleri oluşturan ve güncelleyen fonksiyonlar
 */

const ChartManager = {
    // Tüm grafik nesnelerini sakla
    charts: {
        monthly: null,
        daily: null,
        monthlyPie: null,
        monthlyLine: null,
        monthlyCategory: null,
        monthlyComparison: null,
        weeklyComparison: null
    },
    
    // Grafik yapılandırmaları
    options: {
        responsive: true,
        maintainAspectRatio: false,
        
        // Genel animasyon ayarları
        animation: {
            duration: 1200,  // Animasyon süresi milisaniye
            easing: 'easeOutQuart',  // Smooth easing fonksiyonu
            delay: function(context) {
                // Her veri noktası için kademeli animasyon
                return context.dataIndex * 100 + context.datasetIndex * 100;
            }
        },
        animations: {
            // Veri değerlerine göre sayaç animasyonu
            numbers: {
                type: 'number',
                easing: 'easeInOutSine',
                duration: 1500,
                from: 0
            }
        },
        transitions: {
            active: {
                animation: {
                    duration: 400
                }
            }
        },
        
        // Interaktif hover efektleri
        hover: {
            mode: 'nearest',
            intersect: true,
            animationDuration: 300
        },
        
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    // Legend etiketleri için font
                    font: {
                        family: "'Inter', sans-serif",
                        size: 12
                    },
                    padding: 15,
                    // Legend üzerinde hover olduğunda
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            tooltip: {
                // Tooltip stilleri
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: {
                    family: "'Inter', sans-serif",
                    size: 14,
                    weight: 'bold'
                },
                bodyFont: {
                    family: "'Inter', sans-serif",
                    size: 13
                },
                padding: 12,
                cornerRadius: 8,
                caretSize: 6,
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('tr-TR', {
                                style: 'currency',
                                currency: 'TRY'
                            }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        
        // Sayılar için düşey eksen formatlaması
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    font: {
                        family: "'Inter', sans-serif"
                    },
                    callback: function(value) {
                        return new Intl.NumberFormat('tr-TR', {
                            style: 'currency',
                            currency: 'TRY',
                            maximumFractionDigits: 0
                        }).format(value);
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                ticks: {
                    font: {
                        family: "'Inter', sans-serif"
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            }
        }
    },

    // Ana sayfadaki aylık özet grafiği
    initMonthlyChart() {
        const ctx = document.getElementById('monthly-chart');
        
        if (!ctx) return;
        
        // Eğer zaten bir grafik varsa, onu yok et
        if (this.charts.monthly) {
            this.charts.monthly.destroy();
        }
        
        // Yeni grafik oluştur
        this.charts.monthly = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Gelir',
                        backgroundColor: 'rgba(40, 167, 69, 0.7)',
                        borderColor: 'rgb(40, 167, 69)',
                        borderWidth: 1,
                        data: []
                    },
                    {
                        label: 'Gider',
                        backgroundColor: 'rgba(220, 53, 69, 0.7)',
                        borderColor: 'rgb(220, 53, 69)',
                        borderWidth: 1,
                        data: []
                    }
                ]
            },
            options: this.options
        });
    },

    // Aylık özet grafiğini güncelle
    async updateMonthlyChart() {
        if (!this.charts.monthly) {
            this.initMonthlyChart();
        }
        
        try {
            // Geçerli ayı al
            const today = new Date();
            const currentYear = today.getFullYear();
            const currentMonth = today.getMonth();
            
            // Son 6 ay için veri hesapla
            const labels = [];
            const incomeData = [];
            const expenseData = [];
            
            for (let i = 5; i >= 0; i--) {
                // i ay öncesinin tarihini hesapla
                const date = new Date(currentYear, currentMonth - i, 1);
                const year = date.getFullYear();
                const month = date.getMonth();
                
                // Ay adını al
                const monthName = date.toLocaleString('tr-TR', { month: 'short' });
                labels.push(monthName);
                
                // Bu ay için toplam gelir ve giderleri hesapla
                const totals = await window.dataManager.calculateMonthlyTotals(year, month);
                incomeData.push(totals.totalIncome);
                expenseData.push(totals.totalExpense);
            }
        } catch (error) {
            console.error('Aylık grafik güncellenirken hata:', error);
            return;
        }
        
        // Grafik verilerini güncelle
        this.charts.monthly.data.labels = labels;
        this.charts.monthly.data.datasets[0].data = incomeData;
        this.charts.monthly.data.datasets[1].data = expenseData;
        
        // Grafiği güncelle
        this.charts.monthly.update();
    },

    // Günlük rapor grafiği
    initDailyChart() {
        const ctx = document.getElementById('daily-chart');
        
        if (!ctx) return;
        
        // Eğer zaten bir grafik varsa, onu yok et
        if (this.charts.daily) {
            this.charts.daily.destroy();
        }
        
        // Yeni pasta grafiği oluştur
        this.charts.daily = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                
                // Pasta grafiği için özel animasyon
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1600,
                    easing: 'easeOutQuart',
                    delay: function(context) {
                        // Her dilimi sırayla göster
                        return context.dataIndex * 100;
                    }
                },
                
                // Seçili dilimi vurgulama
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: {
                                family: "'Inter', sans-serif",
                                size: 12
                            },
                            padding: 15,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleFont: {
                            family: "'Inter', sans-serif",
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            family: "'Inter', sans-serif",
                            size: 13
                        },
                        padding: 12,
                        cornerRadius: 8,
                        animations: {
                            opacity: {
                                duration: 400
                            }
                        },
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${new Intl.NumberFormat('tr-TR', {
                                    style: 'currency',
                                    currency: 'TRY'
                                }).format(value)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    },

    // Günlük rapor grafiğini güncelle
    async updateDailyChart(date) {
        if (!this.charts.daily) {
            this.initDailyChart();
        }
        
        try {
            // Seçilen tarih için işlemleri al
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
            
            const transactions = await window.dataManager.getTransactionsByDateRange(startDate, endDate);
            
            // Sadece giderleri filtrele
            const expenses = transactions.filter(t => t.type === 'expense');
            
            // Kategori bilgilerini al
            const expenseCategories = await window.dataManager.getCategories('expense');
        } catch (error) {
            console.error('Günlük grafik güncellenirken hata:', error);
            return;
        }
        
        // Kategori başına toplam giderleri hesapla
        const categoryTotals = {};
        expenses.forEach(expense => {
            if (!categoryTotals[expense.categoryId]) {
                categoryTotals[expense.categoryId] = 0;
            }
            categoryTotals[expense.categoryId] += parseFloat(expense.amount);
        });
        
        // Grafik verilerini hazırla
        const labels = [];
        const data = [];
        const backgroundColor = [];
        
        // Her kategori için verileri ekle
        Object.keys(categoryTotals).forEach(categoryId => {
            const category = expenseCategories.find(c => c.id === categoryId);
            if (category) {
                labels.push(category.name);
                data.push(categoryTotals[categoryId]);
                backgroundColor.push(category.color);
            } else {
                labels.push('Bilinmeyen Kategori');
                data.push(categoryTotals[categoryId]);
                backgroundColor.push('#6c757d');
            }
        });
        
        // Grafik verilerini güncelle
        this.charts.daily.data.labels = labels;
        this.charts.daily.data.datasets[0].data = data;
        this.charts.daily.data.datasets[0].backgroundColor = backgroundColor;
        
        // Grafiği güncelle
        this.charts.daily.update();
    },

    // Aylık rapor için pasta grafiği
    initMonthlyPieChart() {
        const ctx = document.getElementById('monthly-pie-chart');
        
        if (!ctx) return;
        
        // Eğer zaten bir grafik varsa, onu yok et
        if (this.charts.monthlyPie) {
            this.charts.monthlyPie.destroy();
        }
        
        // Yeni pasta grafiği oluştur
        this.charts.monthlyPie = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${new Intl.NumberFormat('tr-TR', {
                                    style: 'currency',
                                    currency: 'TRY'
                                }).format(value)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    },

    // Aylık rapor pasta grafiğini güncelle
    async updateMonthlyPieChart(year, month) {
        if (!this.charts.monthlyPie) {
            this.initMonthlyPieChart();
        }
        
        try {
            // Ay başlangıç ve bitiş tarihlerini hesapla
            const startDate = new Date(year, month, 1);
            const endDate = new Date(year, month + 1, 0);
            
            // Kategori bazlı giderleri al
            const categoryTotals = await window.dataManager.getCategoryTotals('expense', startDate, endDate);
            
            // Kategori bilgilerini al
            const expenseCategories = await window.dataManager.getCategories('expense');
        } catch (error) {
            console.error('Aylık pasta grafik güncellenirken hata:', error);
            return;
        }
        
        // Grafik verilerini hazırla
        const labels = [];
        const data = [];
        const backgroundColor = [];
        
        // Her kategori için verileri ekle
        Object.keys(categoryTotals).forEach(categoryId => {
            const category = expenseCategories.find(c => c.id === categoryId);
            if (category) {
                labels.push(category.name);
                data.push(categoryTotals[categoryId]);
                backgroundColor.push(category.color);
            } else {
                labels.push('Bilinmeyen Kategori');
                data.push(categoryTotals[categoryId]);
                backgroundColor.push('#6c757d');
            }
        });
        
        // Grafik verilerini güncelle
        this.charts.monthlyPie.data.labels = labels;
        this.charts.monthlyPie.data.datasets[0].data = data;
        this.charts.monthlyPie.data.datasets[0].backgroundColor = backgroundColor;
        
        // Grafiği güncelle
        this.charts.monthlyPie.update();
    },

    // Aylık rapor için çizgi grafiği
    initMonthlyLineChart() {
        const ctx = document.getElementById('monthly-line-chart');
        
        if (!ctx) return;
        
        // Eğer zaten bir grafik varsa, onu yok et
        if (this.charts.monthlyLine) {
            this.charts.monthlyLine.destroy();
        }
        
        if (!ctx) return;
        
        // Yeni çizgi grafiği oluştur
        this.charts.monthlyLine = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Gelir',
                        backgroundColor: 'rgba(40, 167, 69, 0.1)',
                        borderColor: 'rgb(40, 167, 69)',
                        borderWidth: 2,
                        tension: 0.1,
                        fill: true,
                        data: []
                    },
                    {
                        label: 'Gider',
                        backgroundColor: 'rgba(220, 53, 69, 0.1)',
                        borderColor: 'rgb(220, 53, 69)',
                        borderWidth: 2,
                        tension: 0.1,
                        fill: true,
                        data: []
                    }
                ]
            },
            options: this.options
        });
    },

    // Aylık rapor çizgi grafiğini güncelle
    async updateMonthlyLineChart(year, month) {
        if (!this.charts.monthlyLine) {
            this.initMonthlyLineChart();
        }
        
        try {
            // Ay başlangıç ve bitiş tarihlerini hesapla
            const startDate = new Date(year, month, 1);
            const endDate = new Date(year, month + 1, 0);
            
            // Bu ay içindeki tüm günleri al
            const daysInMonth = endDate.getDate();
            
            // Verileri tutacak diziler
            const labels = [];
            const incomeData = [];
            const expenseData = [];
            
            // Her gün için veri hesapla
            for (let day = 1; day <= daysInMonth; day++) {
                const currentDate = new Date(year, month, day);
                
                // Gün adını ekle (örn. "1", "2", ...)
                labels.push(day.toString());
                
                // Bu gün için toplam gelir ve giderleri hesapla
                const totals = await window.dataManager.calculateDailyTotals(currentDate);
                incomeData.push(totals.totalIncome);
                expenseData.push(totals.totalExpense);
            }
        } catch (error) {
            console.error('Aylık çizgi grafik güncellenirken hata:', error);
            return;
        }
        
        // Grafik verilerini güncelle
        this.charts.monthlyLine.data.labels = labels;
        this.charts.monthlyLine.data.datasets[0].data = incomeData;
        this.charts.monthlyLine.data.datasets[1].data = expenseData;
        
        // Grafiği güncelle
        this.charts.monthlyLine.update();
    },

    // Kategori analizi için çubuk grafik
    initMonthlyCategoryChart() {
        const ctx = document.getElementById('monthly-category-chart');
        
        if (!ctx) return;
        
        // Eğer zaten bir grafik varsa, onu yok et
        if (this.charts.monthlyCategory) {
            this.charts.monthlyCategory.destroy();
        }
        
        // Yeni çubuk grafik oluştur
        this.charts.monthlyCategory = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Gider Miktarı',
                    backgroundColor: [],
                    borderColor: [],
                    borderWidth: 1,
                    data: []
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',  // Yatay bar grafiği için
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return new Intl.NumberFormat('tr-TR', {
                                    style: 'currency',
                                    currency: 'TRY'
                                }).format(context.raw);
                            }
                        }
                    }
                }
            }
        });
    },
    
    // Kategori analizini güncelle
    async updateMonthlyCategoryChart(year, month) {
        if (!this.charts.monthlyCategory) {
            this.initMonthlyCategoryChart();
        }
        
        try {
            // Ay başlangıç ve bitiş tarihlerini hesapla
            const startDate = new Date(year, month, 1);
            const endDate = new Date(year, month + 1, 0);
            
            // Kategori bazlı giderleri al
            const categoryTotals = await window.dataManager.getCategoryTotals('expense', startDate, endDate);
            
            // Kategori bilgilerini al
            const expenseCategories = await window.dataManager.getCategories('expense');
        } catch (error) {
            console.error('Aylık kategori grafik güncellenirken hata:', error);
            return;
        }
        
        // Grafik verilerini hazırla
        const labels = [];
        const data = [];
        const backgroundColor = [];
        const borderColor = [];
        
        // En yüksekten en düşüğe sırala için array oluştur
        const sortedCategories = [];
        
        Object.keys(categoryTotals).forEach(categoryId => {
            const category = expenseCategories.find(c => c.id === categoryId);
            if (category) {
                sortedCategories.push({
                    id: categoryId,
                    name: category.name,
                    color: category.color,
                    amount: categoryTotals[categoryId]
                });
            }
        });
        
        // Toplamlarına göre sırala (büyükten küçüğe)
        sortedCategories.sort((a, b) => b.amount - a.amount);
        
        // En yüksek 8 kategoriyi göster
        const topCategories = sortedCategories.slice(0, 8);
        
        // Grafik verilerini hazırla
        topCategories.forEach(category => {
            labels.push(category.name);
            data.push(category.amount);
            backgroundColor.push(category.color + '80'); // %50 opaklık için
            borderColor.push(category.color);
        });
        
        // Grafik verilerini güncelle
        this.charts.monthlyCategory.data.labels = labels;
        this.charts.monthlyCategory.data.datasets[0].data = data;
        this.charts.monthlyCategory.data.datasets[0].backgroundColor = backgroundColor;
        this.charts.monthlyCategory.data.datasets[0].borderColor = borderColor;
        
        // Grafiği güncelle
        this.charts.monthlyCategory.update();
    },
    
    // Gelir/Gider karşılaştırma grafiği
    initMonthlyComparisonChart() {
        const ctx = document.getElementById('monthly-comparison-chart');
        
        if (!ctx) return;
        
        // Eğer zaten bir grafik varsa, onu yok et
        if (this.charts.monthlyComparison) {
            this.charts.monthlyComparison.destroy();
        }
        
        // Yeni çubuk grafik oluştur
        this.charts.monthlyComparison = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Gelir',
                        backgroundColor: 'rgba(40, 167, 69, 0.7)',
                        borderColor: 'rgb(40, 167, 69)',
                        borderWidth: 1,
                        data: []
                    },
                    {
                        label: 'Gider',
                        backgroundColor: 'rgba(220, 53, 69, 0.7)',
                        borderColor: 'rgb(220, 53, 69)',
                        borderWidth: 1,
                        data: []
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + new Intl.NumberFormat('tr-TR', {
                                    style: 'currency',
                                    currency: 'TRY'
                                }).format(context.raw);
                            }
                        }
                    }
                }
            }
        });
    },
    
    // Gelir/Gider karşılaştırmasını güncelle
    async updateMonthlyComparisonChart(year, month) {
        if (!this.charts.monthlyComparison) {
            this.initMonthlyComparisonChart();
        }
        
        try {
            // Son 6 ayı göster
            const labels = [];
            const incomeData = [];
            const expenseData = [];
            
            // Şu anki ay dahil son 6 ayı hesapla
            for (let i = 5; i >= 0; i--) {
                let targetMonth = month - i;
                let targetYear = year;
                
                // Yıl geçişlerini kontrol et
                if (targetMonth < 0) {
                    targetYear--;
                    targetMonth += 12;
                }
                
                // Ay adını al
                const date = new Date(targetYear, targetMonth, 1);
                const monthName = date.toLocaleString('tr-TR', { month: 'short' });
                labels.push(monthName);
                
                // Bu ay için toplam gelir ve giderleri hesapla
                const totals = await window.dataManager.calculateMonthlyTotals(targetYear, targetMonth);
                incomeData.push(totals.totalIncome);
                expenseData.push(totals.totalExpense);
            }
        } catch (error) {
            console.error('Aylık karşılaştırma grafik güncellenirken hata:', error);
            return;
        }
        
        // Grafik verilerini güncelle
        this.charts.monthlyComparison.data.labels = labels;
        this.charts.monthlyComparison.data.datasets[0].data = incomeData;
        this.charts.monthlyComparison.data.datasets[1].data = expenseData;
        
        // Grafiği güncelle
        this.charts.monthlyComparison.update();
    },
    
    // Haftalık karşılaştırma grafiği
    initWeeklyComparisonChart() {
        const ctx = document.getElementById('weekly-comparison-chart');
        
        if (!ctx) return;
        
        // Eğer zaten bir grafik varsa, onu yok et
        if (this.charts.weeklyComparison) {
            this.charts.weeklyComparison.destroy();
        }
        
        // Yeni çubuk grafik oluştur
        this.charts.weeklyComparison = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'],
                datasets: [
                    {
                        label: 'Gelir',
                        backgroundColor: 'rgba(40, 167, 69, 0.7)',
                        borderColor: 'rgb(40, 167, 69)',
                        borderWidth: 1,
                        data: [0, 0, 0, 0, 0, 0, 0]
                    },
                    {
                        label: 'Gider',
                        backgroundColor: 'rgba(220, 53, 69, 0.7)',
                        borderColor: 'rgb(220, 53, 69)',
                        borderWidth: 1,
                        data: [0, 0, 0, 0, 0, 0, 0]
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + new Intl.NumberFormat('tr-TR', {
                                    style: 'currency',
                                    currency: 'TRY'
                                }).format(context.raw);
                            }
                        }
                    }
                }
            }
        });
    },
    
    // Haftalık karşılaştırmayı güncelle
    async updateWeeklyComparisonChart(date) {
        if (!this.charts.weeklyComparison) {
            this.initWeeklyComparisonChart();
        }
        
        try {
            const incomeData = [0, 0, 0, 0, 0, 0, 0];
            const expenseData = [0, 0, 0, 0, 0, 0, 0];
            
            // Seçilen günün haftasını bul
            const selectedDate = new Date(date);
            const dayOfWeek = selectedDate.getDay(); // 0: Pazar, 1: Pazartesi, ...
            
            // Haftanın başlangıç günü (Pazartesi)
            const startDate = new Date(selectedDate);
            startDate.setDate(selectedDate.getDate() - ((dayOfWeek === 0 ? 6 : dayOfWeek - 1)));
            startDate.setHours(0, 0, 0, 0);
            
            // Haftanın tüm günleri için işlemleri hesapla
            for (let i = 0; i < 7; i++) {
                const currentDay = new Date(startDate);
                currentDay.setDate(startDate.getDate() + i);
                
                // Günün sonunu hesapla
                const endOfDay = new Date(currentDay);
                endOfDay.setHours(23, 59, 59, 999);
                
                // Bu gün için işlemleri al
                const dayTransactions = await window.dataManager.getTransactionsByDateRange(currentDay, endOfDay);
                
                // Gelir ve giderleri hesapla
                let dayIncome = 0;
                let dayExpense = 0;
                
                dayTransactions.forEach(transaction => {
                    if (transaction.type === 'income') {
                        dayIncome += parseFloat(transaction.amount);
                    } else {
                        dayExpense += parseFloat(transaction.amount);
                    }
                });
                
                // Grafik verilerini güncelle (Pazartesi=0, Pazar=6)
                incomeData[i] = dayIncome;
                expenseData[i] = dayExpense;
            }
            
            // Grafik verilerini güncelle
            this.charts.weeklyComparison.data.datasets[0].data = incomeData;
            this.charts.weeklyComparison.data.datasets[1].data = expenseData;
            
            // Seçili günü vurgula
            // Günleri Pazartesi=0, Pazar=6 olarak ayarla
            const index = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
            
            // Tüm çubuklara normal stil uygula
            for (let i = 0; i < 7; i++) {
                this.charts.weeklyComparison.data.datasets[0].backgroundColor[i] = 'rgba(40, 167, 69, 0.7)';
                this.charts.weeklyComparison.data.datasets[1].backgroundColor[i] = 'rgba(220, 53, 69, 0.7)';
            }
            
            // Seçili güne daha koyu renkler uygula
            this.charts.weeklyComparison.data.datasets[0].backgroundColor[index] = 'rgba(40, 167, 69, 1.0)';
            this.charts.weeklyComparison.data.datasets[1].backgroundColor[index] = 'rgba(220, 53, 69, 1.0)';
            
            // Grafiği güncelle
            this.charts.weeklyComparison.update();
        } catch (error) {
            console.error('Haftalık grafik güncellenirken hata:', error);
        }
    },

    // Sayfa ilk yüklendiğinde grafikleri başlat
    initAllCharts() {
        this.initMonthlyChart();
        this.updateMonthlyChart();
        
        this.initDailyChart();
        // Günlük rapor için bugünün tarihini kullan
        this.updateDailyChart(new Date());
        
        this.initMonthlyPieChart();
        this.initMonthlyLineChart();
        this.initMonthlyCategoryChart();
        this.initMonthlyComparisonChart();
        this.initWeeklyComparisonChart();
        
        // Aylık rapor için geçerli ay ve yıl
        const today = new Date();
        this.updateMonthlyPieChart(today.getFullYear(), today.getMonth());
        this.updateMonthlyLineChart(today.getFullYear(), today.getMonth());
        this.updateMonthlyCategoryChart(today.getFullYear(), today.getMonth());
        this.updateMonthlyComparisonChart(today.getFullYear(), today.getMonth());
        this.updateWeeklyComparisonChart(today);
    }
};

// Sayfa yüklendiğinde grafikleri başlat
document.addEventListener('DOMContentLoaded', () => {
    function initializeCharts() {
        try {
            console.log('Grafikler yükleniyor...');
            
            // Chart.js'in yüklenmiş olduğunu kontrol et
            if (typeof Chart === 'undefined') {
                console.error('HATA: Chart.js kütüphanesi yüklenemedi!');
                return false;
            }
            
            // Grafikleri başlat
            ChartManager.initAllCharts();
            console.log('Grafikler başarıyla yüklendi!');
            return true;
        } catch (error) {
            console.error('Grafik oluşturma hatası:', error);
            return false;
        }
    }
    
    // DataStore yüklendikten sonra grafikleri başlat
    // İlk denemede başarısız olursa, birkaç kez daha dene
    let attempts = 0;
    const maxAttempts = 3;
    
    function tryInitCharts() {
        // DataStore'un yüklenmesi için biraz bekle
        setTimeout(() => {
            attempts++;
            console.log(`Grafikleri yükleme denemesi ${attempts}/${maxAttempts}`);
            
            if (!initializeCharts() && attempts < maxAttempts) {
                // Başarısız olursa tekrar dene, ama daha uzun bekle
                tryInitCharts();
            }
        }, 500 * attempts); // Her denemede bekleme süresini artır
    }
    
    // İlk denemeyi başlat
    tryInitCharts();
});