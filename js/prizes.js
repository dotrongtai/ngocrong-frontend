const PRIZES = [
  { id: 457, quantity: 5, name: "Thỏi vàng", icon: "assets/images/prizes/thoivang.png" },
  { id: 16, quantity: 2, name: "Ngọc Rồng 3 sao", icon: "assets/images/prizes/3sao.png" },
  { id: 1144, quantity: 1, name: "Phượng hoàng lửa", icon: "assets/images/prizes/phuonghoanglua.png" },
  {
    id: null,
    quantity: null,
    name: "Bộ Item Cấp 2",
    icon: "assets/images/prizes/cuongno2.png", // thay bằng icon thực tế bạn có
    items: [
      { id: 1151, quantity: 30 },
      { id: 1152, quantity: 30 },
      { id: 1153, quantity: 30 },
      { id: 1154, quantity: 30 }
    ]
  },
  { id: 1497, quantity: 1, name: "Pet rồng", icon: "assets/images/prizes/petrong.png" },
  { id: 987, quantity: 10, name: "Đá bảo vệ", icon: "assets/images/prizes/dabaove.png" },
  { id: 16, quantity: 5, name: "Ngọc Rồng 3 sao", icon: "assets/images/prizes/3sao.png" },
  { id: 1559, quantity: 1, name: "Hộp Chọn Set Kích Hoạt", icon: "assets/images/prizes/capsuleskhtuchon.png" },
  { id: 828, quantity: 100, name: "Mảnh Khủng long", icon: "assets/images/prizes/manhkhunglong.png" },
  { id: 1567, quantity: 1, name: "Cải trang Frieren", icon: "assets/images/prizes/Frieren.png" }
];
const SECTOR_COLORS = ["#3a1d63", "#5a2e8c"];
const SPIN_COSTS_FALLBACK = [5, 30, 70, 100, 150, 250, 450, 600, 750, 1000];