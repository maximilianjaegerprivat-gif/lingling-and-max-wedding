/* =====================================================================
   Tiny QR Code generator (byte mode, error-correction level M).
   Used for the SEPA transfer code in the gifts section. No dependencies.
   Follows ISO/IEC 18004; structure after the public-domain qrcodegen.
   ===================================================================== */
(function () {
  'use strict';

  var ECC_PER_BLOCK = [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28];
  var NUM_BLOCKS = [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49];
  var FORMAT_BITS_M = 0;

  function rawDataModules(ver) {
    var r = (16 * ver + 128) * ver + 64;
    if (ver >= 2) {
      var n = Math.floor(ver / 7) + 2;
      r -= (25 * n - 10) * n - 55;
      if (ver >= 7) { r -= 36; }
    }
    return r;
  }
  function dataCodewords(ver) {
    return Math.floor(rawDataModules(ver) / 8) - ECC_PER_BLOCK[ver] * NUM_BLOCKS[ver];
  }
  function toBytes(str) {
    if (window.TextEncoder) { return Array.prototype.slice.call(new TextEncoder().encode(str)); }
    var s = unescape(encodeURIComponent(str)), out = [];
    for (var i = 0; i < s.length; i++) { out.push(s.charCodeAt(i)); }
    return out;
  }
  function gfMul(x, y) {
    var z = 0;
    for (var i = 7; i >= 0; i--) {
      z = (z << 1) ^ ((z >>> 7) * 0x11D);
      z ^= ((y >>> i) & 1) * x;
    }
    return z & 0xFF;
  }
  function rsDivisor(degree) {
    var r = [], i, j;
    for (i = 0; i < degree - 1; i++) { r.push(0); }
    r.push(1);
    var root = 1;
    for (i = 0; i < degree; i++) {
      for (j = 0; j < r.length; j++) {
        r[j] = gfMul(r[j], root);
        if (j + 1 < r.length) { r[j] ^= r[j + 1]; }
      }
      root = gfMul(root, 2);
    }
    return r;
  }
  function rsRemainder(data, divisor) {
    var r = divisor.map(function () { return 0; });
    data.forEach(function (b) {
      var factor = b ^ r.shift();
      r.push(0);
      divisor.forEach(function (coef, i) { r[i] ^= gfMul(coef, factor); });
    });
    return r;
  }

  function encode(text) {
    var bytes = toBytes(text);
    var ver, capBits, i, j, k;
    for (ver = 1; ver <= 40; ver++) {
      capBits = dataCodewords(ver) * 8;
      if (4 + (ver < 10 ? 8 : 16) + bytes.length * 8 <= capBits) { break; }
    }
    if (ver > 40) { throw new Error('Text too long for a QR code'); }

    /* ---- data bits ---- */
    var bits = [];
    function append(val, len) { for (var b = len - 1; b >= 0; b--) { bits.push((val >>> b) & 1); } }
    append(4, 4);
    append(bytes.length, ver < 10 ? 8 : 16);
    bytes.forEach(function (b) { append(b, 8); });
    append(0, Math.min(4, capBits - bits.length));
    append(0, (8 - bits.length % 8) % 8);
    for (var pad = 0xEC; bits.length < capBits; pad ^= 0xEC ^ 0x11) { append(pad, 8); }
    var data = [];
    for (i = 0; i < bits.length; i += 8) {
      var byte = 0;
      for (k = 0; k < 8; k++) { byte = (byte << 1) | bits[i + k]; }
      data.push(byte);
    }

    /* ---- error correction and interleaving ---- */
    var numBlocks = NUM_BLOCKS[ver], eccLen = ECC_PER_BLOCK[ver];
    var raw = Math.floor(rawDataModules(ver) / 8);
    var numShort = numBlocks - raw % numBlocks, shortLen = Math.floor(raw / numBlocks);
    var blocks = [], div = rsDivisor(eccLen), pos = 0;
    for (i = 0; i < numBlocks; i++) {
      var datLen = shortLen - eccLen + (i < numShort ? 0 : 1);
      var dat = data.slice(pos, pos + datLen);
      pos += datLen;
      var ecc = rsRemainder(dat, div);
      if (i < numShort) { dat.push(0); }
      blocks.push(dat.concat(ecc));
    }
    var codewords = [];
    for (i = 0; i < blocks[0].length; i++) {
      for (j = 0; j < blocks.length; j++) {
        if (i !== shortLen - eccLen || j >= numShort) { codewords.push(blocks[j][i]); }
      }
    }

    /* ---- matrix and function patterns ---- */
    var size = ver * 4 + 17;
    var modules = [], isFunc = [];
    for (i = 0; i < size; i++) {
      modules.push(new Array(size).fill(false));
      isFunc.push(new Array(size).fill(false));
    }
    function setF(x, y, dark) { modules[y][x] = dark; isFunc[y][x] = true; }
    for (i = 0; i < size; i++) { setF(6, i, i % 2 === 0); setF(i, 6, i % 2 === 0); }
    function finder(cx, cy) {
      for (var dy = -4; dy <= 4; dy++) {
        for (var dx = -4; dx <= 4; dx++) {
          var d = Math.max(Math.abs(dx), Math.abs(dy)), x = cx + dx, y = cy + dy;
          if (x >= 0 && x < size && y >= 0 && y < size) { setF(x, y, d !== 2 && d !== 4); }
        }
      }
    }
    finder(3, 3); finder(size - 4, 3); finder(3, size - 4);
    var align = [];
    if (ver > 1) {
      var n = Math.floor(ver / 7) + 2;
      var step = ver === 32 ? 26 : Math.ceil((ver * 4 + 4) / (n * 2 - 2)) * 2;
      align = [6];
      for (var p = size - 7; align.length < n; p -= step) { align.splice(1, 0, p); }
    }
    for (i = 0; i < align.length; i++) {
      for (j = 0; j < align.length; j++) {
        if ((i === 0 && j === 0) || (i === 0 && j === align.length - 1) || (i === align.length - 1 && j === 0)) { continue; }
        for (var ady = -2; ady <= 2; ady++) {
          for (var adx = -2; adx <= 2; adx++) {
            setF(align[i] + adx, align[j] + ady, Math.max(Math.abs(adx), Math.abs(ady)) !== 1);
          }
        }
      }
    }
    function drawFormat(mask) {
      var d = (FORMAT_BITS_M << 3) | mask, rem = d, q;
      for (q = 0; q < 10; q++) { rem = (rem << 1) ^ ((rem >>> 9) * 0x537); }
      var fb = ((d << 10) | rem) ^ 0x5412;
      function bit(b) { return ((fb >>> b) & 1) === 1; }
      for (q = 0; q <= 5; q++) { setF(8, q, bit(q)); }
      setF(8, 7, bit(6)); setF(8, 8, bit(7)); setF(7, 8, bit(8));
      for (q = 9; q < 15; q++) { setF(14 - q, 8, bit(q)); }
      for (q = 0; q < 8; q++) { setF(size - 1 - q, 8, bit(q)); }
      for (q = 8; q < 15; q++) { setF(8, size - 15 + q, bit(q)); }
      setF(8, size - 8, true);
    }
    drawFormat(0);
    if (ver >= 7) {
      var vrem = ver, vq;
      for (vq = 0; vq < 12; vq++) { vrem = (vrem << 1) ^ ((vrem >>> 11) * 0x1F25); }
      var vb = (ver << 12) | vrem;
      for (vq = 0; vq < 18; vq++) {
        var vbit = ((vb >>> vq) & 1) === 1, a = size - 11 + vq % 3, b2 = Math.floor(vq / 3);
        setF(a, b2, vbit); setF(b2, a, vbit);
      }
    }

    /* ---- data placement ---- */
    var bi = 0;
    for (var right = size - 1; right >= 1; right -= 2) {
      if (right === 6) { right = 5; }
      for (var vert = 0; vert < size; vert++) {
        for (j = 0; j < 2; j++) {
          var x = right - j, upward = ((right + 1) & 2) === 0, y = upward ? size - 1 - vert : vert;
          if (!isFunc[y][x] && bi < codewords.length * 8) {
            modules[y][x] = ((codewords[bi >>> 3] >>> (7 - (bi & 7))) & 1) === 1;
            bi++;
          }
        }
      }
    }

    /* ---- masking ---- */
    function maskBit(m, x, y) {
      switch (m) {
        case 0: return (x + y) % 2 === 0;
        case 1: return y % 2 === 0;
        case 2: return x % 3 === 0;
        case 3: return (x + y) % 3 === 0;
        case 4: return (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0;
        case 5: return x * y % 2 + x * y % 3 === 0;
        case 6: return (x * y % 2 + x * y % 3) % 2 === 0;
        default: return ((x + y) % 2 + x * y % 3) % 2 === 0;
      }
    }
    function applyMask(m) {
      for (var yy = 0; yy < size; yy++) {
        for (var xx = 0; xx < size; xx++) {
          if (!isFunc[yy][xx] && maskBit(m, xx, yy)) { modules[yy][xx] = !modules[yy][xx]; }
        }
      }
    }
    function penalty() {
      var score = 0, yy, xx, run, col, dark = 0;
      function runs(get) {
        run = 0; col = null;
        for (var t = 0; t < size; t++) {
          var v = get(t);
          if (v === col) { run++; if (run === 5) { score += 3; } else if (run > 5) { score++; } }
          else { col = v; run = 1; }
        }
      }
      function finderLike(get) {
        for (var s = 0; s + 11 <= size; s++) {
          var pat = [true, false, true, true, true, false, true];
          var a = true, b = true, t;
          for (t = 0; t < 7; t++) { if (get(s + t) !== pat[t]) { a = false; } if (get(s + 4 + t) !== pat[t]) { b = false; } }
          if (a) { for (t = 7; t < 11; t++) { if (get(s + t)) { a = false; } } }
          if (b) { for (t = 0; t < 4; t++) { if (get(s + t)) { b = false; } } }
          if (a || b) { score += 40; }
        }
      }
      for (yy = 0; yy < size; yy++) {
        (function (row) { runs(function (t) { return modules[row][t]; }); finderLike(function (t) { return modules[row][t]; }); })(yy);
        for (xx = 0; xx < size; xx++) { if (modules[yy][xx]) { dark++; } }
      }
      for (xx = 0; xx < size; xx++) {
        (function (c) { runs(function (t) { return modules[t][c]; }); finderLike(function (t) { return modules[t][c]; }); })(xx);
      }
      for (yy = 0; yy < size - 1; yy++) {
        for (xx = 0; xx < size - 1; xx++) {
          var c0 = modules[yy][xx];
          if (c0 === modules[yy][xx + 1] && c0 === modules[yy + 1][xx] && c0 === modules[yy + 1][xx + 1]) { score += 3; }
        }
      }
      var total = size * size;
      score += Math.floor(Math.abs(dark * 20 - total * 10) / total) * 10;
      return score;
    }
    var best = 0, bestScore = Infinity;
    for (var m = 0; m < 8; m++) {
      applyMask(m); drawFormat(m);
      var sc = penalty();
      if (sc < bestScore) { bestScore = sc; best = m; }
      applyMask(m);
    }
    applyMask(best); drawFormat(best);

    return {
      size: size,
      version: ver,
      mask: best,
      get: function (x, y) { return modules[y][x]; }
    };
  }

  window.LMQR = { encode: encode };
})();
