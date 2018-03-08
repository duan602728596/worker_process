const expect = chai.expect;

/* 测试函数 */
function add(x, y){
  return x + y;
}

function exe(x, y){
  return x * y;
}

function play(a, b, c){
  return exe(a, b) + c;
}

function ef(x, y, m, n){
  return exe(x, y) + add(m, n);
}


describe('worker_process', function(){

  it('item 1', function(){
    worker_process(add, [3, 2]).then((result)=>{
      expect(result).to.eql(5);
    });
  });

  it('item 2', function(){
    worker_process(play, [3, 2, 6], exe).then((result)=>{
      expect(result).to.eql(12);
    });
  });

  it('item 3', function(){
    worker_process(play, [3, 2, 6, 5], exe, add).then((result)=>{
      expect(result).to.eql(17);
    });
  });

  it('item 4', function(){
    Promise.all([
      worker_process(add, [3, 2]),
      worker_process(play, [3, 2, 6], exe)
    ]).then((result)=>{
      expect(result[0] + result[1]).to.eql(17);
    });
  });

  it('item 5', function(){
    worker_process(function(a, b){
      const c = a + b;
    }).then((result)=>{
      expect(result).to.be.undefined;
    });
  });

});

/* =========================== 大计算 =========================== */
// 生成随机数组
function randomArray(){
  const arr = [];
  for(let i = 0; i < 10 ** 6; i++){
    arr.push(Math.floor(Math.random() * 10 ** 6));
  }
  return arr;
}
const _rawArray = randomArray();

// 排序函数
function quickSort(rawArray){
  const len = rawArray.length;
  if(rawArray.length <= 1){
    return rawArray;
  }
  const benchmark = rawArray[0];
  let left = [];
  let right = [];
  for(let i = 1; i < len; i++){
    if(rawArray[i] > benchmark){
      right.push(rawArray[i]);
    }else{
      left.push(rawArray[i]);
    }
  }
  if(left.length > 1){
    left = quickSort(left);
  }
  if(right.length > 1){
    right = quickSort(right);
  }
  return left.concat([benchmark], right);
}

let st1 = new Date().getTime();
quickSort(_rawArray);
let et1 = new Date().getTime();
console.log('普通时间：', et1 - st1);

let st2 = new Date().getTime();
worker_process(quickSort, [_rawArray]).then((result)=>{
  let et2 = new Date().getTime();
  console.log('多进程时间：', et2 - st2);
});
