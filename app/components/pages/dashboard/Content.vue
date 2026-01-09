<script setup lang="ts">
const stats = [
  { title: "Total Students", value: "2,543", change: 12.5, changeLabel: "from last month", icon: "users", color: "primary" as const },
  { title: "Active Courses", value: "48", change: 4.2, changeLabel: "from last month", icon: "book-open", color: "success" as const },
  { title: "Enrollments", value: "1,423", change: 24.4, changeLabel: "from last month", icon: "academic-cap", color: "warning" as const },
  { title: "Completion Rate", value: "83.5%", change: 1.5, changeLabel: "from last month", icon: "trending-up", color: "primary" as const },
];

// Chart Data
const enrollmentSeries = ref([
  {
    name: "Enrollments",
    data: [31, 40, 28, 51, 42, 109, 100],
  },
]);

const enrollmentChartOptions = ref({
  chart: {
    type: "area",
    toolbar: { show: false },
    fontFamily: "Inter, sans-serif",
  },
  dataLabels: { enabled: false },
  stroke: { curve: "smooth" },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    labels: { style: { colors: "#64748b" } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: { style: { colors: "#64748b" } },
  },
  grid: {
    borderColor: "#e2e8f0",
    strokeDashArray: 4,
  },
  colors: ["#3b82f6"],
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.2,
      stops: [0, 90, 100],
    },
  },
});

const coursePopSeries = ref([
  {
    name: "Views",
    data: [400, 430, 448, 470, 540],
  },
]);

const coursePopChartOptions = ref({
  chart: {
    type: "bar",
    toolbar: { show: false },
    fontFamily: "Inter, sans-serif",
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: true,
      barHeight: "50%",
    },
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ["Intro to Go", "Vue 3 Masterclass", "UI/UX Design", "Advanced Python", "React 18"],
    labels: { style: { colors: "#64748b" } },
  },
  yaxis: {
    labels: { style: { colors: "#64748b" } },
  },
  grid: { show: false },
  colors: ["#10b981"],
});
</script>

<template>
  <div class="w-full space-y-6 animate-fade-in">
    <!-- Page header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">LMS Dashboard</h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Welcome back! Here's an overview of your learning platform.
        </p>
      </div>
      <UiButton variant="elevated" color="primary">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        New Course
      </UiButton>
    </div>

    <!-- Stats grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardStatsCard
        v-for="stat in stats"
        :key="stat.title"
        :title="stat.title"
        :value="stat.value"
        :change="stat.change"
        :change-label="stat.changeLabel"
        :icon="stat.icon"
        :color="stat.color"
      />
    </div>

    <!-- Charts row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <DashboardChartCard
        title="Enrollment Trends"
        subtitle="Monthly enrollments for the current year"
      >
        <template #actions>
          <select class="text-sm bg-transparent border-0 text-slate-600 dark:text-slate-400 focus:ring-0 cursor-pointer">
            <option>This Year</option>
            <option>Last Year</option>
          </select>
        </template>
        <UiChart 
            type="area" 
            height="100%" 
            :series="enrollmentSeries" 
            :options="enrollmentChartOptions" 
        />
      </DashboardChartCard>

      <DashboardChartCard
        title="Course Popularity"
        subtitle="Most visited courses by students"
      >
        <UiChart 
            type="bar" 
            height="100%" 
            :series="coursePopSeries" 
            :options="coursePopChartOptions" 
        />
      </DashboardChartCard>
    </div>

    <!-- Bottom section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent activity -->
      <div class="lg:col-span-2">
        <DashboardRecentActivity />
      </div>

      <!-- Quick actions -->
      <UiCard>
        <template #header>
          <h3 class="font-semibold text-slate-900 dark:text-white">Quick Actions</h3>
        </template>
        <div class="space-y-3">
          <button class="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors text-left">
            <div class="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p class="font-medium text-slate-900 dark:text-white">Create Course</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">Add a new course curriculum</p>
            </div>
          </button>
          <button class="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors text-left">
            <div class="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <p class="font-medium text-slate-900 dark:text-white">Register Student</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">Manually enroll a student</p>
            </div>
          </button>
          <button class="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors text-left">
            <div class="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p class="font-medium text-slate-900 dark:text-white">View Reports</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">Export student progress data</p>
            </div>
          </button>
        </div>
      </UiCard>
    </div>
  </div>
</template>
