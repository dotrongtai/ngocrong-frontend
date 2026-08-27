/* ==========================================================
   posts.js — dữ liệu bài đăng dùng chung
   Nạp ở cả index.html và dien-dan.html:
       <script src="js/posts.js"></script>

   THÊM BÀI MỚI: chèn object vào ĐẦU mảng BAI_DANG.
     id       : chuỗi không dấu, không trùng — dùng cho link trực tiếp
     icon     : emoji hiện bên trái
     tieuDe   : tiêu đề bài
     tomTat   : mô tả ngắn hiện ở danh sách
     tag      : nhãn hiển thị
     tagClass : "" (cam - sự kiện) | "tag-tin" (xanh) | "tag-bao-tri" (xám)
     ngay     : "YYYY-MM-DD"
     ghim     : true để luôn nằm trên cùng
     lien     : có giá trị -> bấm vào chuyển sang trang đó
                để trống -> mở hộp đọc bài ngay tại chỗ
     noi      : nội dung HTML hiện trong hộp đọc bài
   ========================================================== */

const BAI_DANG = [
  {
    id: "co-che-trong-game",
    icon: "⚙️",
    tieuDe: "Cơ Chế Trong Game — Những Điều Cần Biết",
    tomTat: "Nhập giftcode ở đâu, cày chay lên vàng thế nào, các mốc đua top và cách nhận set kích hoạt miễn phí.",
    tag: "Tin tức",
    tagClass: "tag-tin",
    ngay: "2026-08-27",
    ghim: false,
    lien: "coche.html",
    noi: `
      <p><strong>Giftcode.</strong> Nhập tại NPC Santa — dùng được cả giftcode trong game
      và giftcode nhận từ Vòng Quay May Mắn trên web.</p>

      <p><strong>Cày chay lên vàng.</strong> Server không chặn cày chay. Ngọc và vàng thoải mái,
      không cần nạp vẫn lên được.</p>

      <p><strong>Set kích hoạt M miễn phí.</strong> Lên 3 map đầu của cả 3 hành tinh là nhận được.</p>

      <p><strong>Đua top sự kiện.</strong> Reset 7 ngày một lần, phần thưởng là capsule kích hoạt.
      Ngoài ra còn các bảng đua top sức mạnh, top nạp và top nhiệm vụ.</p>

      <p><strong>Săn boss tích điểm.</strong> Hạ boss để tích điểm rồi mang đi đổi quà.</p>

      <p><strong>Nội dung nhóm.</strong> Ngọc Rồng Sao Đen và hệ thống bang hội đều đã mở.</p>

      <p><strong>Sự kiện Trung Thu</strong> đang diễn ra — đốt lồng đèn hoa đăng và săn Khỉ Đột.</p>
    `
  },
  {
    id: "trung-thu-2026",
    icon: "🏮",
    tieuDe: "Sự Kiện Trung Thu — Đốt Lồng Đèn & Săn Khỉ Đột",
    tomTat: "Gom Diêm và Dầu thắp đèn hoa đăng nhận quà, dùng Mặt trăng gọi Khỉ Đột lấy Đuôi khỉ x2 kinh nghiệm.",
    tag: "Sự kiện",
    tagClass: "",
    ngay: "2026-08-27",
    ghim: true,
    lien: "trungthu.html",
    noi: `
      <p>Rằm tháng Tám đã về với <strong>Ngọc Rồng Hoa Mai</strong>. Mùa này có hai việc đáng làm.</p>
      <p><strong>Đốt lồng đèn hoa đăng.</strong> Săn boss để nhặt Diêm, đánh quái để nhặt Dầu.
      Ăn Bưởi trước khi farm thì dầu ra nhiều hơn hẳn. Có đủ hai thứ thì về làng thắp đèn,
      mỗi ngọn đèn là một phần quà ngẫu nhiên.</p>
      <p><strong>Săn Khỉ Đột.</strong> Thắp đèn có lúc rơi ra Mặt trăng. Dùng nó ở map thường là
      Khỉ Đột hiện ra ngay chỗ bạn đứng. Hạ được thì có Đuôi khỉ, dùng vào là x2 kinh nghiệm
      trong 30 phút.</p>
      <p>Thi thoảng trăng hoá đỏ — đó là lúc <strong>Khỉ Đột Vương</strong> xuống núi.</p>
    `
  }
];

/* ---------- tiện ích ---------- */

function dinhDangNgay(chuoi) {
  try {
    return new Date(chuoi).toLocaleDateString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric"
    });
  } catch (e) {
    return chuoi;
  }
}

/** Sắp xếp: bài ghim lên trước, sau đó mới nhất trước */
function sapXepBai(ds) {
  return ds.slice().sort(function (a, b) {
    if (!!b.ghim !== !!a.ghim) return b.ghim ? 1 : -1;
    return new Date(b.ngay) - new Date(a.ngay);
  });
}

/**
 * Vẽ danh sách bài đăng vào một khung.
 * @param {string} khungId  id của thẻ chứa
 * @param {number} gioiHan  số bài tối đa, bỏ trống là vẽ hết
 */
function veBaiDang(khungId, gioiHan) {
  const khung = document.getElementById(khungId);
  if (!khung) return;

  let ds = sapXepBai(BAI_DANG);
  if (gioiHan) ds = ds.slice(0, gioiHan);

  if (!ds.length) {
    khung.innerHTML = '<div class="news-empty">Chưa có bài đăng nào.</div>';
    return;
  }

  khung.innerHTML = "";

  ds.forEach(function (b) {
    const the = document.createElement(b.lien ? "a" : "div");
    the.className = "post-card";

    if (b.lien) {
      the.href = b.lien;
    } else {
      the.setAttribute("role", "button");
      the.setAttribute("tabindex", "0");
      the.addEventListener("click", function () { moBaiDang(b.id); });
      the.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          moBaiDang(b.id);
        }
      });
    }

    the.innerHTML =
      '<div class="post-icon">' + (b.icon || "📰") + '</div>' +
      '<div class="post-body">' +
        '<div class="post-title">' + b.tieuDe + '</div>' +
        '<div class="post-desc">' + b.tomTat + '</div>' +
        '<div class="post-meta">' +
          '<span class="post-tag ' + (b.tagClass || "") + '">' + b.tag + '</span>' +
          '<span><i class="fa-regular fa-calendar"></i> ' + dinhDangNgay(b.ngay) + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="post-go"><i class="fa-solid fa-chevron-right"></i></div>';

    khung.appendChild(the);
  });
}

/** Mở hộp đọc bài (cần có #postModal trong trang) */
function moBaiDang(id) {
  const b = BAI_DANG.find(function (x) { return x.id === id; });
  const hop = document.getElementById("postModal");
  if (!b || !hop) return;

  document.getElementById("postModalTitle").textContent = b.tieuDe;

  const nhan = document.getElementById("postModalTag");
  nhan.textContent = b.tag;
  nhan.className = "post-tag " + (b.tagClass || "");

  document.getElementById("postModalDate").innerHTML =
    '<i class="fa-regular fa-calendar"></i> ' + dinhDangNgay(b.ngay);
  document.getElementById("postModalBody").innerHTML = b.noi || "";
  document.getElementById("postModalActions").innerHTML = b.lien
    ? '<a href="' + b.lien + '" class="btn-secondary" style="text-decoration:none; display:inline-block;">Xem chi tiết</a>'
    : "";

  hop.style.display = "flex";
}

function dongBaiDang() {
  const hop = document.getElementById("postModal");
  if (hop) hop.style.display = "none";
}

/* đóng khi bấm ra ngoài hoặc nhấn Esc */
window.addEventListener("click", function (e) {
  if (e.target === document.getElementById("postModal")) dongBaiDang();
});
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape") dongBaiDang();
});