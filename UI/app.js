Dropzone.autoDiscover = false;

function init() {
    let dz = new Dropzone("#dropzone", {
        url: "/",
        maxFiles: 1,
        addRemoveLinks: true,
        dictDefaultMessage: "Some Message",
        autoProcessQueue: false
    });
    
    dz.on("addedfile", function() {
        if (dz.files[1]!=null) {
            dz.removeFile(dz.files[0]);        
        }
    });

    dz.on("complete", function (file) {
        let imageData = file.dataURL;
        
        var url = "http://127.0.0.1:5000//classify_image";

        $.post(url, {
            image_data: file.dataURL
        },function(data, status) {
            
            console.log(data);
            if (!data || data.length==0) {
                $("#resultHolder").hide();
                $("#divClassTable").hide();                
                $("#error").show();
                return;
            }
          let leaders ={"Amit_Shah":"Amit Shah, born in 1964, is a key figure in Indian politics. He serves as the Union Home Minister and has been instrumental in BJP's recent electoral triumphs. Known for his strong organizational skills and political acumen, he faces both praise for his strategic leadership and criticism for some policies. A close confidante of Prime Minister Modi, he is considered a potential successor and remains a powerful force shaping India's future.", 
          "mk_stalin":"Muthuvel Karunanidhi Stalin, or MKS, is the current Chief Minister of Tamil Nadu and president of the DMK party. He carries the legacy of his father, M. Karunanidhi, a beloved figure in state politics. Starting his political journey in the 80s, MKS has served as Mayor of Chennai, a minister, and eventually Deputy Chief Minister before taking the helm in 2021. Known for his focus on rural development, public welfare, and embracing technology in governance, he enjoys strong public support due to his simplicity and accessibility. He faces challenges like unemployment and infrastructure needs while being seen as a potential national figure. He continues to build on his father's legacy while carving his own path in Tamil Nadu politics.", 
          "nirmala_sitharaman":"Nirmala Sitharaman is an Indian politician and the current Finance Minister of India . Born on August 18, 1959, she is a member of the Bharatiya Janata Party (BJP) and has played key roles in various government ministries. Sitharaman has been a prominent figure in Indian politics, known for her economic policies and financial expertise. Before her political career, she worked in the corporate sector and has been an advocate for economic reforms" ,
          "sonia_gandhi": "Sonia Gandhi is an Italian-born Indian politician and the widow of former Indian Prime Minister Rajiv Gandhi. Born on December 9, 1946, she became a naturalized Indian citizen after her marriage to Rajiv Gandhi. Sonia Gandhi is the longest-serving president of the Indian National Congress (INC), one of India's major political parties. Despite reluctance to enter politics initially, she played a significant role in shaping the Congress party's fortunes. Although she declined the position of Prime Minister in 2004, Sonia Gandhi remained a powerful figure as the United Progressive Alliance (UPA) chairperson, influencing key political decisions during her tenure.",
          "Sushma_Swaraj":"Sushma Swaraj (1952-2019) was an eminent Indian politician associated with the Bharatiya Janata Party (BJP). Born on February 14, 1952, she held various prominent positions in Indian politics. Sushma Swaraj served as the Minister of External Affairs of India from 2014 to 2019 and was known for her effective diplomacy and responsiveness on social media. She also held key roles such as the Leader of the Opposition in the Lok Sabha and the Chief Minister of Delhi. Swaraj was widely respected for her eloquence, dedication, and contributions to Indian politics until her passing in August 2019."}
            
            let match = null;
            let bestScore = -1;
            for (let i=0;i<data.length;++i) {
                let maxScoreForThisClass = Math.max(...data[i].class_probability);
                if(maxScoreForThisClass>bestScore) {
                    match = data[i];
                    bestScore = maxScoreForThisClass;
                }
            }
            if (match) {
                $("#error").hide();
                $("#resultHolder").show();
                $("#divClassTable").show();
                $("#resultHolder").html($(`[data-leader="${match.class}"`).html());
                

                $("#info").html(leaders[match.class]);
            }
                        
        });
    });

    $("#submitBtn").on('click', function (e) {
        dz.processQueue();		
    });
}

$(document).ready(function() {
    console.log( "ready!" );
    $("#error").hide();
    $("#resultHolder").hide();
    $("#divClassTable").hide();

    init();
});