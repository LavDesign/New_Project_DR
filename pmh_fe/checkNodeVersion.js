/**
 * This script will check node base version against provided Min and Max values
 *
 * @summary checks node base version
 * @author Kevin Vega <kevin.vega@accenture.com>
 *
 * Created at     : 2022-02-23 11:05:32 
 * Last modified  : 2022-06-15 10:07:22
 */


const result = process.versions;
let passedCheck = 0;

console.log("[[[ ----------------------------  ]]]");
console.log(" ...CHECKING NODE VERSION =>", (process.env.NODE_MIN) ? "MIN:"+parseInt(process.env.NODE_MIN) : "", (process.env.NODE_MAX) ? "MAX:"+parseInt(process.env.NODE_MAX) : "");

if (result && result.node && (process.env.NODE_MIN || process.env.NODE_MAX)) {
  if (parseInt(result.node) >= parseInt(process.env.NODE_MIN || 0) && parseInt(result.node) <= parseInt(process.env.NODE_MAX || 10000)) {
    console.log("     ===> PASSED: "+result.node+" <===");
    passedCheck = 1;
  } else {
    console.log("     ===> FAILED: "+result.node+" <===");
    console.log("     ===>       EXIT SCRIPT       <===");
  }
} else {
    console.log("SOMETHING WENT WRONG WHILE CHECKING!");
}

console.log("[[[ ----------------------------  ]]]");
if (passedCheck < 1) {
    process.exit(1);
}
