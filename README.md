# worker_process

## 使用方法：

### 引入模块
```javascript
import worker_process from 'worker_process';
// 或
window.worker_process;
```

### 使用
```javascript
function add(x, y){
  return x + y;
}

worker_process(add, [3, 2]).then((result)=>{
  console.log(result);  // 5
});
```

当函数内需要执行其他函数时，如下方法
```javascript
function add(x, y){
  return x + y;
}

function exe(x, y){
  return x * y;
}

function play(a, b, c){
  return exe(a, b) + c;
}

worker_process(play, [3, 2, 6, 5], exe, add /* 函数可以依次传递下去 */ ).then((result)=>{
  console.log(result);  // 17
});
```

### 注意
1、如果想在多线程内执行复杂的函数，请自行构造web worker。   
2、web worker，无法访问下例JavaScript对象：
* window 对象
* document 对象
* parent 对象

所以所有的函数都不应该带如上的JavaScript对象。