

  const successMessage1 = <%- JSON.stringify(successMessage1) %>;
      if (successMessage1!=undefined && successMessage1.length > 0) {
        
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: successMessage1[0], // Display the first success message
          showConfirmButton: false,
          timer: 1500 // Auto-close after 1.5 seconds
        });
      }

    
    async function handleUpdate(){
        alert("hello")
        let inp=document.querySelector('#pupdate')
        let dropdown=document.querySelector('.drop-down')
        let pname=document.querySelector("#productName")
        let pimage=document.querySelector("#productImage")
        let pprice=document.querySelector('#price')
        let ppid=document.querySelector('#productId')
        let pquantity=document.querySelector('#quantity')

        let find=await fetch(`http://localhost:5500/product/search?q=${encodeURIComponent(inp.value)}`)
        let res=await find.json()
        dropdown.style.display="block"
        
        
        dropdown.innerHTML=""
        
        res.map((item)=>{
            
            let div=document.createElement('div');
            
            div.innerHTML=`
            
            <h3>pid: ${item.ProductId}</h3>
            <h3>pname: ${item.ProductName}</h3>
            <hr>
            `
            
            
            dropdown.appendChild(div)
            div.onclick=async function(){
                
                inp.value=""
                dropdown.style.display='none'
                
                let data=await fetch(`http://localhost:5500/product/search/${item.ProductId}`)
                let prod=await data.json()
                ppid.value=item.ProductId
                pname.value=item.ProductName
                pprice.value=item.ProductPrice
                pquantity.value=item.ProductQuantity
                


                

            }
            
            


        })

        function handleSubmit(){
            
            window.location.href="http://localhost:5500/product/entry"
        }
        
        
        
        
        

        


}

