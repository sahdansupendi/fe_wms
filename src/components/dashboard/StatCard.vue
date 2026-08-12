<script setup>
defineProps({
  label: String,
  value: [String, Number],
  trend: String,
  trendType: {
    type: String,
    default: 'positive' // 'positive' | 'negative' | 'neutral'
  },
  delay: {
    type: Number,
    default: 0
  }
});
</script>

<template>
  <div class="stat-card" :style="{ animationDelay: delay + 's' }">
    <p class="stat-label">{{ label }}</p>
    <p class="stat-value">{{ value }}</p>
    <p v-if="trend" class="stat-trend" :class="trendType">
      {{ trend }}
    </p>
  </div>
</template>

<style scoped>
.stat-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px 18px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
  animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}

.stat-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.stat-label {
  font-family: 'Sora', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 8px;
}

.stat-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.02em;
  margin-bottom: 4px;
}

.stat-trend {
  font-size: 11px;
  font-weight: 600;
}

.stat-trend.positive { color: #16a34a; }
.stat-trend.negative { color: #dc2626; }
.stat-trend.neutral { color: #6b7280; }

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
