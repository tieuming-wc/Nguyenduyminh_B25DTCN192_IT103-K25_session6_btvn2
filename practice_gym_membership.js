if (typeof prompt === "undefined") {
  var prompt = require("prompt-sync")({ sigint: true });
}

let registeredMembers = 0;
let totalRevenue = 0;
let checkInCount = 0;

let lastMemberName = "";
let lastMemberPackage = "";
let lastMemberMonths = 0;
let lastMemberPT = 0;
let lastMemberCardCode = "";
let isRegistered = false;

let choice;

do {
  console.log("\n==============================================");
  console.log("   HỆ THỐNG QUẢN LÝ HỘI VIÊN GYM FITNESS      ");
  console.log("==============================================");
  console.log("1. Đăng ký và chuẩn hóa hồ sơ hội viên mới");
  console.log("2. Tính tiền gói tập và áp dụng chính sách giảm giá");
  console.log("3. Quét mã thẻ check-in tại cửa quay");
  console.log("4. Xuất báo cáo thống kê ca trực và thoát");
  console.log("==============================================");

  choice = Number(prompt("Mời bạn chọn chức năng (1-4):"));

  switch (choice) {
    case 1: {
      console.log("\n--- CHỨC NĂNG 1: ĐĂNG KÝ HỘI VIÊN MỚI ---");

      let rawName = prompt("Nhập họ và tên hội viên: ");
      if (!rawName || rawName.trim() === "") {
        console.log("❌ Họ tên không được để trống!");
        break;
      }
      lastMemberName = rawName
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      let pkgInput = prompt("Chọn gói tập (STANDARD / VIP): ");
      if (!pkgInput) {
        console.log("❌ Gói tập không hợp lệ!");
        break;
      }
      let pkgUpper = pkgInput.trim().toUpperCase();
      if (pkgUpper !== "STANDARD" && pkgUpper !== "VIP") {
        console.log("❌ Gói tập chỉ nhận 'STANDARD' hoặc 'VIP'!");
        break;
      }
      lastMemberPackage = pkgUpper;

      let monthsInput = Number(prompt("Nhập số tháng đăng ký (tối thiểu 1): "));
      if (isNaN(monthsInput) || monthsInput < 1) {
        console.log("❌ Số tháng đăng ký không hợp lệ!");
        break;
      }
      lastMemberMonths = monthsInput;

      let ptInput = Number(
        prompt("Nhập số buổi PT kèm riêng (nhập 0 nếu không thuê): "),
      );
      if (isNaN(ptInput) || ptInput < 0) {
        console.log("❌ Số buổi PT không hợp lệ!");
        break;
      }
      lastMemberPT = ptInput;

      const currentYear = new Date().getFullYear();
      lastMemberCardCode = `GYM-${lastMemberPackage}-${currentYear}`;

      registeredMembers++;
      isRegistered = true;

      console.log("\n✅ ĐĂNG KÝ HỒ SƠ THÀNH CÔNG!");
      console.log(`- Hội viên: ${lastMemberName}`);
      console.log(`- Gói tập: ${lastMemberPackage}`);
      console.log(`- Thời hạn: ${lastMemberMonths} tháng`);
      console.log(`- Buổi PT: ${lastMemberPT} buổi`);
      console.log(`- Mã thẻ cấp: ${lastMemberCardCode}`);
      break;
    }

    case 2: {
      console.log("\n--- CHỨC NĂNG 2: TÍNH TIỀN GÓI TẬP ---");

      if (!isRegistered) {
        console.log(
          "⚠️ Vui lòng thực hiện Đăng ký hội viên mới (Chức năng 1) trước khi tính tiền!",
        );
        break;
      }

      const pricePerMonth = lastMemberPackage === "VIP" ? 800000 : 500000;
      const pricePerPT = 300000;

      const basePackageCost = pricePerMonth * lastMemberMonths;
      const ptCost = pricePerPT * lastMemberPT;
      const subTotal = basePackageCost + ptCost;

      let discountRate = 0;
      if (lastMemberMonths >= 12) {
        discountRate = 0.25;
      } else if (lastMemberMonths >= 6) {
        discountRate = 0.15;
      }

      const discountAmount = basePackageCost * discountRate;
      const finalAmount = subTotal - discountAmount;

      totalRevenue += finalAmount;
      isRegistered = false;

      console.log("\n================ HÓA ĐƠN THANH TOÁN ================");
      console.log(`Khách hàng: ${lastMemberName}`);
      console.log(`Mã thẻ:     ${lastMemberCardCode}`);
      console.log(
        `Gói tập:    ${lastMemberPackage} (${pricePerMonth.toLocaleString("vi-VN")} VNĐ/tháng) x ${lastMemberMonths} tháng`,
      );
      console.log(
        `Thuê PT:    ${lastMemberPT} buổi (${(lastMemberPT * pricePerPT).toLocaleString("vi-VN")} VNĐ)`,
      );
      console.log(`----------------------------------------------------`);
      console.log(
        `Tạm tính:             ${subTotal.toLocaleString("vi-VN")} VNĐ`,
      );
      console.log(
        `Giảm giá gói (${discountRate * 100}%):  -${discountAmount.toLocaleString("vi-VN")} VNĐ`,
      );
      console.log(`----------------------------------------------------`);
      console.log(
        `TỔNG THU:             ${finalAmount.toLocaleString("vi-VN")} VNĐ`,
      );
      console.log("====================================================");
      break;
    }

    case 3: {
      console.log("\n--- CHỨC NĂNG 3: QUÉT MÃ THẺ CHECK-IN ---");
      let cardCodeInput = prompt("Mời quét / nhập mã thẻ check-in: ");

      if (!cardCodeInput || cardCodeInput.trim() === "") {
        console.log("❌ Mã thẻ không được để trống!");
        break;
      }

      cardCodeInput = cardCodeInput.trim().toUpperCase();
      const currentYearStr = new Date().getFullYear().toString();

      const isValidPrefix = cardCodeInput.startsWith("GYM-");
      const isValidSuffix = cardCodeInput.endsWith(currentYearStr);

      if (isValidPrefix && isValidSuffix) {
        checkInCount++;
        console.log(`✅ CHECK-IN THÀNH CÔNG! [Mã thẻ: ${cardCodeInput}]`);
        console.log(`Cửa quay đã mở. Chúc hội viên có buổi tập vui vẻ!`);
      } else {
        console.log(`❌ CHECK-IN THẤT BẠI! Mã thẻ không đúng định dạng.`);
        console.log(
          `👉 Mã thẻ hợp lệ phải bắt đầu bằng 'GYM-' và kết thúc bằng '${currentYearStr}' (VD: GYM-VIP-${currentYearStr}).`,
        );
      }
      break;
    }

    case 4: {
      console.log("\n==============================================");
      console.log("       BÁO CÁO TỔNG KẾT CA TRỰC LỄ TÂN        ");
      console.log("==============================================");
      console.log(`1. Số hội viên đăng ký mới: ${registeredMembers} lượt`);
      console.log(`2. Lượt check-in thành công:  ${checkInCount} lượt`);
      console.log(
        `3. Tổng doanh thu thu được:   ${totalRevenue.toLocaleString("vi-VN")} VNĐ`,
      );
      console.log("==============================================");
      console.log("Cảm ơn bạn đã sử dụng hệ thống! Đang thoát...");
      break;
    }

    default: {
      console.log("❌ Lựa chọn không hợp lệ! Vui lòng nhập số từ 1 đến 4.");
      break;
    }
  }
} while (choice !== 4);
