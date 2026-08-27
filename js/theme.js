/* ==========================================================
   theme.js — chế độ Sáng / Tối dùng chung cho mọi trang
   Nạp trong <head>, TRƯỚC khi body hiển thị, để tránh chớp màu:
     <script src="js/theme.js"></script>

   Chế độ được ghi lên thẻ <html data-che-do="toi|sang">
   nên mọi trang và mọi file CSS đều đọc được.
   ========================================================== */
(function () {
  "use strict";

  var KHOA = "nro-che-do";
  var goc = document.documentElement;

  function doc() {
    try {
      return localStorage.getItem(KHOA);
    } catch (e) {
      return null;
    }
  }

  function ghi(v) {
    try {
      localStorage.setItem(KHOA, v);
    } catch (e) {
      /* trình duyệt chặn lưu trữ - vẫn chạy bình thường, chỉ không nhớ */
    }
  }

  function macDinh() {
    var luu = doc();
    if (luu === "toi" || luu === "sang") {
      return luu;
    }
    try {
      return window.matchMedia("(prefers-color-scheme: light)").matches ? "sang" : "toi";
    } catch (e) {
      return "toi";
    }
  }

  /* Đặt chế độ NGAY LẬP TỨC, trước khi body render */
  goc.setAttribute("data-che-do", macDinh());

  function hienTai() {
    return goc.getAttribute("data-che-do") === "sang" ? "sang" : "toi";
  }

  function ap(v) {
    goc.setAttribute("data-che-do", v);
    ghi(v);
    veNut();
    /* để trang khác lắng nghe nếu cần */
    document.dispatchEvent(new CustomEvent("cheDoThayDoi", { detail: { cheDo: v } }));
  }

  function veNut() {
    var toi = hienTai() === "toi";
    var nuts = document.querySelectorAll(".nut-che-do");
    for (var i = 0; i < nuts.length; i++) {
      var icon = nuts[i].querySelector(".nut-che-do-icon");
      var chu = nuts[i].querySelector(".nut-che-do-chu");
      if (icon) icon.textContent = toi ? "☀️" : "🌙";
      if (chu) chu.textContent = toi ? "Ban ngày" : "Đêm rằm";
      nuts[i].setAttribute("aria-pressed", toi ? "false" : "true");
      nuts[i].setAttribute("title", toi ? "Chuyển sang giao diện ban ngày" : "Chuyển sang giao diện đêm rằm");
    }
  }

  /* Bắt click ở cấp document, nên navbar nạp động lúc nào cũng chạy được */
  document.addEventListener("click", function (e) {
    var nut = e.target.closest ? e.target.closest(".nut-che-do") : null;
    if (!nut) return;
    e.preventDefault();
    ap(hienTai() === "toi" ? "sang" : "toi");
  });

  /* Vẽ lại nhãn khi navbar được chèn vào sau */
  document.addEventListener("DOMContentLoaded", veNut);
  window.addEventListener("load", veNut);

  /* Đồng bộ giữa các tab đang mở */
  window.addEventListener("storage", function (e) {
    if (e.key === KHOA && (e.newValue === "toi" || e.newValue === "sang")) {
      goc.setAttribute("data-che-do", e.newValue);
      veNut();
    }
  });

  /* Cho phép gọi tay: CheDo.dat("sang") */
  window.CheDo = { dat: ap, lay: hienTai, veNut: veNut };
})();