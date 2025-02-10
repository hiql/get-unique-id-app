use std::fs;

use nanoid::nanoid;
use short_uuid::short;
use snowflake::SnowflakeIdGenerator;
use sonyflake::Sonyflake;
use tauri::menu::{AboutMetadata, MenuBuilder, MenuItemBuilder, SubmenuBuilder};
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_opener::OpenerExt;
use uuid::Uuid;

#[tauri::command]
fn gen_uuid_v1(n: u32) -> Vec<String> {
    let mut list = vec![];
    for _ in 0..n {
        let id = Uuid::now_v1(&[1, 2, 3, 4, 5, 6]).hyphenated().to_string();
        list.push(id);
    }
    list
}

#[tauri::command]
fn gen_uuid_v3(namespace: &str, name: &str, n: u32) -> Vec<String> {
    if name.is_empty() {
        return vec![];
    }
    let new_id = match Uuid::try_parse(namespace) {
        Ok(v) => Uuid::new_v3(&v, name.as_bytes()).hyphenated().to_string(),
        _ => "".to_string(),
    };
    let mut list = vec![];
    for _ in 0..n {
        let id = if new_id.is_empty() {
            let r = Uuid::new_v4();
            Uuid::new_v3(&r, name.as_bytes()).hyphenated().to_string()
        } else {
            new_id.clone()
        };
        list.push(id);
    }
    list
}

#[tauri::command]
fn gen_uuid_v4(n: u32) -> Vec<String> {
    let mut list = vec![];
    for _ in 0..n {
        let id = Uuid::new_v4().hyphenated().to_string();
        list.push(id);
    }
    list
}

#[tauri::command]
fn gen_uuid_v5(namespace: &str, name: &str, n: u32) -> Vec<String> {
    if name.is_empty() {
        return vec![];
    }
    let new_id = match Uuid::try_parse(namespace) {
        Ok(v) => Uuid::new_v5(&v, name.as_bytes()).hyphenated().to_string(),
        _ => "".to_string(),
    };
    let mut list = vec![];
    for _ in 0..n {
        let id = if new_id.is_empty() {
            let r = Uuid::new_v4();
            Uuid::new_v5(&r, name.as_bytes()).hyphenated().to_string()
        } else {
            new_id.clone()
        };
        list.push(id);
    }
    list
}

#[tauri::command]
fn gen_uuid_v6(n: u32) -> Vec<String> {
    let mut list = vec![];
    for _ in 0..n {
        let id = Uuid::now_v6(&[1, 2, 3, 4, 5, 6]).hyphenated().to_string();
        list.push(id);
    }
    list
}

#[tauri::command]
fn gen_uuid_v7(n: u32) -> Vec<String> {
    let mut list = vec![];
    for _ in 0..n {
        let id = Uuid::now_v7().hyphenated().to_string();
        list.push(id);
    }
    list
}

#[tauri::command]
fn gen_short_uuid(n: u32) -> Vec<String> {
    let mut list = vec![];
    for _ in 0..n {
        let shortened_uuid = short!();
        let id = shortened_uuid.to_string();
        list.push(id);
    }
    list
}

#[tauri::command]
fn gen_nil_uuid(n: u32) -> Vec<String> {
    let mut list = vec![];
    let id = "00000000-0000-0000-0000-000000000000".to_string();
    for _ in 0..n {
        list.push(id.clone());
    }
    list
}

#[tauri::command]
fn gen_max_uuid(n: u32) -> Vec<String> {
    let mut list = vec![];
    let id = "FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF".to_string();
    for _ in 0..n {
        list.push(id.clone());
    }
    list
}

#[tauri::command]
fn gen_nano_id(n: u32) -> Vec<String> {
    let mut list = vec![];
    for _ in 0..n {
        let id = nanoid!();
        list.push(id);
    }
    list
}

#[tauri::command]
fn gen_ulid(n: u32) -> Vec<String> {
    let mut list = vec![];
    let mut gen = ulid::Generator::new();
    for _ in 0..n {
        let id = gen.generate().unwrap();
        list.push(id.to_string());
    }
    list
}

#[tauri::command]
fn gen_cuid(n: u32) -> Vec<String> {
    let mut list = vec![];
    for _ in 0..n {
        let id = cuid::cuid1().unwrap();
        list.push(id);
    }
    list
}

#[tauri::command]
fn gen_cuid2(n: u32) -> Vec<String> {
    let mut list = vec![];
    for _ in 0..n {
        let id = cuid::cuid2();
        list.push(id);
    }
    list
}

#[tauri::command]
fn gen_nuid(n: u32) -> Vec<String> {
    let mut list = vec![];
    let mut gen = nuid::NUID::new();
    for _ in 0..n {
        let id = gen.next().to_string();
        list.push(id);
    }
    list
}

#[tauri::command]
fn gen_snowflake(n: u32) -> Vec<String> {
    let mut list = vec![];
    let mut g = SnowflakeIdGenerator::new(1, 1);
    for _ in 0..n {
        let id = g.generate().to_string();
        list.push(id);
    }
    list
}

#[tauri::command]
fn gen_sonyflake(n: u32) -> Vec<String> {
    let mut list = vec![];
    let gen = Sonyflake::new().unwrap();
    for _ in 0..n {
        let id = format!("{}", gen.next_id().unwrap());
        list.push(id);
    }
    list
}

#[tauri::command]
fn gen_upid(prefix: &str, n: u32) -> Vec<String> {
    let mut list = vec![];
    for _ in 0..n {
        let id = upid::Upid::new(prefix).to_string();
        list.push(id);
    }
    list
}

#[tauri::command]
fn gen_tsid(n: u32) -> Vec<String> {
    let mut list = vec![];
    for _ in 0..n {
        let id = tsid::create_tsid().to_string();
        list.push(id);
    }
    list
}

#[tauri::command]
fn gen_object_id(n: u32) -> Vec<String> {
    let mut list = vec![];
    for _ in 0..n {
        let id = bson::oid::ObjectId::new().to_string();
        list.push(id)
    }
    list
}

#[tauri::command]
fn gen_scru128(n: u32) -> Vec<String> {
    let mut list = vec![];
    for _ in 0..n {
        let id = scru128::new_string();
        list.push(id);
    }
    list
}

#[tauri::command]
async fn save_to_file(app: tauri::AppHandle, content: &str, file_name: &str) -> Result<(), String> {
    let file_path = app
        .dialog()
        .file()
        .set_file_name(file_name)
        .blocking_save_file();
    if let Some(path) = file_path {
        match fs::write(path.to_string(), content) {
            Ok(_) => println!("File saved"),
            Err(e) => eprintln!("Failed to save file: {}", e),
        }
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let github = MenuItemBuilder::new("Github").id("github").build(app)?;
            let rfc9562 = MenuItemBuilder::new("RFC 9562").id("rfc9562").build(app)?;
            let app_submenu = SubmenuBuilder::new(app, "App")
                .about(Some(AboutMetadata {
                    ..Default::default()
                }))
                .separator()
                .item(&github)
                .item(&rfc9562)
                .separator()
                .services()
                .separator()
                .hide()
                .hide_others()
                .quit()
                .build()?;
            let menu = MenuBuilder::new(app).items(&[&app_submenu]).build()?;
            app.set_menu(menu)?;
            app.on_menu_event(move |app, event| {
                if event.id() == github.id() {
                    app.opener()
                        .open_url("https://github.com/hiql/get-unique-id-app", None::<&str>)
                        .unwrap();
                } else if event.id() == rfc9562.id() {
                    app.opener()
                        .open_url("https://www.rfc-editor.org/rfc/rfc9562.html", None::<&str>)
                        .unwrap();
                }
            });
            Ok(())
        })
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            save_to_file,
            gen_uuid_v1,
            gen_uuid_v3,
            gen_uuid_v4,
            gen_uuid_v5,
            gen_uuid_v6,
            gen_uuid_v7,
            gen_short_uuid,
            gen_nil_uuid,
            gen_max_uuid,
            gen_ulid,
            gen_upid,
            gen_nano_id,
            gen_cuid,
            gen_cuid2,
            gen_nuid,
            gen_tsid,
            gen_snowflake,
            gen_sonyflake,
            gen_object_id,
            gen_scru128
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_gen_nil_empty_uuid() {
        let expected = "00000000-0000-0000-0000-000000000000";
        let ids = gen_nil_uuid(5);
        println!("{:?}", ids);
        assert_eq!(5, ids.len());
        assert_eq!(expected, ids[0]);
    }
}
