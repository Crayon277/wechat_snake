// snake.js
var app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    score: 0,//比分
    maxscore: 0,//最高分
    startx: 0,
    starty: 0,
    endx: 0,
    endy: 0,//以上四个做方向判断来用
    ground: [],//存储操场每个方块
    rows: 28,
    cols: 22,//操场大小
    snake: [],//存蛇
    food: [],//存食物
    direction: '',//方向
    modalHidden: true,
    timer: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var maxscore = wx.getStorageSync('maxscore');
    if(!maxscore) maxscore=0
    this.setData({
      maxscore:maxscore
    });
    this.initGround(this.data.rows,this.data.cols);
    //操场渲染
    this.initSnake(3);
    //贪吃蛇渲染
    this.createFood();
    
    this.move();

  },
  initGround:function(rows,cols){
    //初始化操场
    //console.log([rows,cols]);
    
    for(var i=0;i<rows;i++){
      var arr = [];
      this.data.ground.push(arr);
      for(var j=0;j<cols;j++){
        this.data.ground[i].push(0);
      }
    }
   // console.log(this.data.ground);
  },

  initSnake:function(len){
    for(var i= 0;i<len;i++){
      this.data.ground[0][i] = 1;
      this.data.snake.push([0,i]);
      //???Todo 
      //这里没有用this.setData方法来设置snake可以吗？
      //还是用对象方法是可以的？
    }
  },

  createFood:function(){
    var x=Math.floor(Math.random()*this.data.rows);
    var y=Math.floor(Math.random()*this.data.cols);
    var ground = this.data.ground;
    ground[x][y] = 2;
    this.setData({
      ground:ground,
      food:[x,y]
    })
  },


  tapStart:function(e){
    //console.log("at tapstart");
    //clearInterval(this.data.timer);
    // this.setData({
    //   startx:e.touches[0].pageX,
    //   starty:e.touches[0].pageY
    // }); 
    this.data.startx = e.touches[0].pageX;
    this.data.starty = e.touches[0].pageY;
    
    //console.log([this.data.startx,this.data.starty]);
  },
  tapMove:function(e){
    this.setData({
      endx:e.touches[0].pageX,
      endy:e.touches[0].pageY
    });
    //console.log(e.touches);
  },
  tapEnd:function(event){
    //console.log("start",[this.data.startx,this.data.starty]);
    //console.log("end",[this.data.endx,this.data.endy]);
    var heng = (this.data.endx)?(this.data.endx - this.data.startx):0;
    var shu = (this.data.endy)?(this.data.endy-this.data.starty):0;
    //??? 当endx，endy为0的时候，就不计算差了，heng，shu为0了，什么道理
    if(Math.abs(heng) > 5 || Math.abs(shu) > 5){
      var direction = (Math.abs(heng)> Math.abs(shu))?this.computeDir(1,heng):this.computeDir(0,shu);
      //console.log(direction);
      switch(direction){
        case 'left':
          if(this.data.direction == "right") return;
          break;
        case 'right':
          if(this.data.direction == 'left') return;
          break;
        case 'top':
          if(this.data.direction == 'bottom') return;
          break;
        case 'bottom':
          if(this.data.direction =='top') return;
          break;
        default:
      }
      this.setData({
        startx:0,
        starty:0,
        endx:0,
        endy:0,
        direction:direction
      });
    }
    //console.log("at tapEnd");

  //

  },
  computeDir(ifheng,dif){
    if(ifheng) return (dif>0)?"right":"left";
    return (dif>0)?"bottom":"top";
  },

  move:function(){
    var that = this;
    
    this.data.timer = setInterval(function(){
      //console.log("at move",that.data.direction);
      that.changeDirection(that.data.direction);
      // that.setData({
      //   ground:that.data.ground
      // })
    },400);
  },

  changeDirection:function(dir){
    //console.log("at changeDirection");
    switch(dir){
      case 'left':
        //console.log("at changeDirection left");
        this.changeleft();
        break;
      case 'right':
        //console.log("at changeDirection right");
        this.changeright();
        break;
      case 'bottom':
        //console.log("at changeDirection bottom");
        //console.log("at case bottom");
        this.changebottom();
        //console.log("at case bottom skip changebottom");
        break;
      case 'top':
        //console.log("at changeDirection top");
        this.changetop();
        break;
      default:
    }
  },
  changeleft:function(){
    //console.log("at changeDirection left");
    var arr = this.data.snake;
    var len = this.data.snake.length;
    var snakeHead = arr[len-1]; //这里要取出的是贪吃蛇头操场块的y坐标值
    var snakeTail = arr[0]; //取出的是[x,y] 这个是二元的
    var ground = this.data.ground;
    ground[snakeTail[0]][snakeTail[1]] = 0;

    for(var i=0;i<len-1;i++){
      arr[i] = arr[i+1];
    }

    var x = snakeHead[0];
    var y = snakeHead[1] - 1;
    arr[len-1] = [x,y];
    var check = this.checkGame(arr);//每次移动都要检查
    //先检查再将贪吃蛇画上，因为可能就画不了！！！
    //但是数据检查的都是上一个时刻的。因为最新的数据这条语句后面执行
    if(check){
      ground[x][y] = 1;
    }
    this.setData({
      ground:ground,
      snake:arr
    });
  },

  changeright:function(){
    //console.log("at changeDirection right");
    var arr = this.data.snake;
    var len = this.data.snake.length;
    var snakeHead = arr[len-1];
    var snakeTail = arr[0];
    var ground = this.data.ground;
    
    ground[snakeTail[0]][snakeTail[1]] = 0;
    
    for(var i=0;i<len-1;i++){
      arr[i] = arr[i+1];
    }

    var x = snakeHead[0];
    var y = snakeHead[1]+1;
    arr[len-1] = [x,y];
    var check = this.checkGame(arr);
    
    // for(var i = 1;i<len;i++){
    //   ground[arr[i][0]][arr[i][1]] = 1;
    // }
    // 我觉得没有必要，因为原来这些已经是1了，只是头尾改一下而已。
    //if(check){
    ground[x][y] = 1;
    //}
    console.log("at changeright after checkgame");
    this.setData({
      snake:arr,
      ground:ground
    })
  },

  changetop:function(){
    //console.log("at changeDirection top");
    var arr = this.data.snake;
    var len = this.data.snake.length;
    var ground = this.data.ground;
    var snakeHead = arr[len-1];
    var snakeTail = arr[0];

    ground[snakeTail[0]][snakeTail[1]] = 0;
    for(var i = 0; i<len-1;i++){
      arr[i] = arr[i+1];
    }
    var x = snakeHead[0] - 1;
    var y = snakeHead[1];
    arr[len-1] = [x,y];
    var check = this.checkGame(arr);
    if(check){
      ground[x][y] = 1;
    }
    this.setData({
      ground:ground,
      snake:arr
    });
  },

  changebottom:function(){
    //console.log("at changeDirection bottom");
    var arr = this.data.snake;
    var len = this.data.snake.length;
    var ground = this.data.ground;
    var snakeHead = arr[len-1];
    var snakeTail = arr[0];

    ground[snakeTail[0]][snakeTail[1]] = 0;
    for(var i = 0 ; i< len-1;i++){
      arr[i]  = arr[i+1];
    }

    var x = snakeHead[0]+1;
    var y = snakeHead[1];
    arr[len-1] = [x,y];
    var check = this.checkGame(arr);
    if(check){
      ground[x][y] = 1;
    }
    this.setData({
      ground:ground,
      snake:arr
    });
  },



  checkGame:function(snakeNow){
    //console.log("at checkGame");
    var arr = snakeNow;
    var len = snakeNow.length;
    var snakeHead = arr[len-1];
    var snakeTail = arr[0];
    //检测是否碰到墙壁
    if(snakeHead[0] < 0 || snakeHead[0]>=this.data.rows ||
       snakeHead[1] < 0 || snakeHead[1]>=this.data.cols){
         console.log("at clearInterval");
         clearInterval(this.data.timer);
         ground[0][0] = 2;
         this.setData({
           modalHidden:false,
           ground:ground
         });
         return false;
       }
    //检测是否碰到自己的身体(注意，是自己身体的任何一个地方！！！)
    for(var i = 0;i<len-1;i++){
      if(snakeHead[0] == arr[i][0] && snakeHead[1] == arr[i][1]){
        clearInterval(this.data.timer);
        this.setData({
          modalHidden:false,
        })
        return false;
      }
    }

    //检测是否吃到食物

    if(snakeHead[0] == this.data.food[0] && snakeHead[1] == this.data.food[1]){
      arr.unshift(this.data.snake[0]);
      this.setData({
        score:this.data.score+10
      });
      this.storeScore();
      this.createFood();
    }
    return true;
  },
  modalChange:function(){
    this.setData({
      score: 0,//比分
      ground: [],//存储操场每个方块
      snake: [],//存蛇
      food: [],//存食物
      direction: '',//方向
      modalHidden: true,
    });
    this.onLoad();
  },
  storeScore:function(){
    if(this.data.maxscore < this.data.score){
      this.setData({
        maxscore:this.data.score
      })
      //这里应该表现为，在没有死之前，如果分数大于当前的
      //那么应该是实时更新最高分的那一栏。
      wx.setStorageSync("maxscore",this.data.maxscore);
    }
  },
  
  
})