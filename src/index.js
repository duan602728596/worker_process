/**
 * worker process
 * @param { Function } execute: 执行函数
 */

function worker_process(execute: Function): Promise<void>{
  /* arguments */
  let argu: Array<any> = [];  // 传递参数
  if(arguments.length > 1 && typeof arguments[1] === 'object' && arguments[1] instanceof Array){
    argu = arguments[1];
  }

  /* 拼接辅助函数 */
  let fnBlob: string = '';
  for(let i: number = argu ? 2 : 1, j: number = arguments.length; i < j; i++){
    fnBlob += `${ arguments[i] } \n`;
  }

  /* 拼接addEventListener */
  const txt: string = `addEventListener('message', function(event){
    const data = event.data;
    postMessage(
      ${ execute.name }(...event.data.__arguments__)
    );
  }, false);`;

  /* 创建blob */
  let blob: ?Blob = new Blob(`${ fnBlob } \n ${ execute } \n ${ txt }`.split(''));
  let url: ?string = window.URL.createObjectURL(blob);

  /* web worker */
  let worker: ?Worker = new Worker(url);

  worker.postMessage({
    __arguments__: argu
  });

  return new Promise(function(resolve: Function, reject: Function): void{
    worker.addEventListener('message', function(event: Event): void{
      resolve(event.data);
      worker.terminate();
      // 清除blob和url
      window.URL.revokeObjectURL(url);
      blob = null;
      url = null;
      worker = null;
    }, false);
  });
}

export default worker_process;